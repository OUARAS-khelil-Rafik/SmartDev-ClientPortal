
import { Project, Task, Booking, User } from '../types';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random-looking Google Meet code (e.g., abc-defg-hij)
const generateUniqueMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({length:3}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
    const part2 = Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
    const part3 = Array.from({length:3}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
    
    // Generates a unique looking link like https://meet.google.com/xyz-abcd-efg
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
};

class MockApi {
  // --- Auth & Users ---
  
  private getUsers(): User[] {
    const stored = localStorage.getItem('nexus_users');
    // Default Admin User if empty
    if (!stored) {
        const admin: User = { id: 'admin1', name: 'Nexus Admin', email: 'admin@nexus.dev', role: 'admin' };
        this.saveUsers([admin]);
        return [admin];
    }
    return JSON.parse(stored);
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('nexus_users', JSON.stringify(users));
  }

  // Public method for Admin Dashboard to list clients
  async getAllUsers(): Promise<User[]> {
      await delay(500);
      return this.getUsers();
  }

  async login(email: string): Promise<User> {
    await delay(800);
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // For demo purposes, we accept any password, but check email existence
    if (!user) throw new Error('User not found. Please sign up.');
    // Block login for users that are pending or rejected
    if ((user as any).status === 'pending') throw new Error('Your account is pending approval by an administrator.');
    if ((user as any).status === 'rejected') throw new Error('Your account registration was rejected.');
    return user;
  }

    // Google sign-in removed: this method intentionally deleted.

  async signup(name: string, email: string): Promise<User> {
    await delay(800);
    const users = this.getUsers();
    if (users.find(u => u.email === email)) throw new Error('Email already exists');

    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'client' // Default role
    } as User;
    // New signups require admin approval by default
    newUser.status = 'pending';
    users.push(newUser);
    this.saveUsers(users);
    
    // Assign a demo project to new user
    // Do not create demo project until admin approves the user
    return newUser;
  }
    

  // --- User moderation (admin) ---

  async approveUser(userId: string): Promise<User[]> {
    await delay(400);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx].status = 'approved';
    this.saveUsers(users);
    return users;
  }

  async rejectUser(userId: string): Promise<User[]> {
    await delay(300);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx].status = 'rejected';
    this.saveUsers(users);
    return users;
  }

  async deleteUser(userId: string): Promise<User[]> {
    await delay(300);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users.splice(idx, 1);
      this.saveUsers(users);
    }
    // Also handle related projects and bookings
    const projects = this.getStoredProjects().filter(p => p.clientId !== userId);
    this.saveProjects(projects);

    // For bookings: mark any previously confirmed bookings as cancelled and remove any other bookings for the deleted user
    const bookings = this.getStoredBookings();
    let changed = false;
    const newBookings: Booking[] = [];
    for (let b of bookings) {
      if (b.userId === userId) {
        // Cancel confirmed bookings so admin/user can see history
        if (b.status === 'confirmed') {
          b.status = 'cancelled';
          b.meetLink = undefined;
          newBookings.push(b);
          changed = true;
        } else {
          // drop other bookings for deleted user
          changed = true;
        }
      } else {
        newBookings.push(b);
      }
    }
    if (changed) this.saveBookings(newBookings);
    return users;
  }


  // --- Projects ---

  private getStoredProjects(): Project[] {
    const stored = localStorage.getItem('nexus_projects');
    return stored ? JSON.parse(stored) : [];
  }

  private saveProjects(projects: Project[]) {
    localStorage.setItem('nexus_projects', JSON.stringify(projects));
  }



  // Create project (client action)
  // Only a client can create a project for themselves via this method.
  async createProject(
    projectData: { name: string, clientId: string, deadline: string, status: Project['status'] },
    actor?: { id: string, role: 'admin' | 'client' }
  ): Promise<Project> {
      await delay(600);
      // Enforce that only the client themselves can create their project through this method
      if (!actor || actor.role !== 'client' || actor.id !== projectData.clientId) {
        throw new Error('Only the client may create their own project via this endpoint');
      }
      const projects = this.getStoredProjects();
      // Prevent duplicate project name for same client (case-insensitive)
      const exists = projects.find(p => p.clientId === projectData.clientId && p.name.toLowerCase() === projectData.name.toLowerCase());
      if (exists) {
        throw new Error('You already have a project with that name. Please choose a different name.');
      }
      const newProject: Project = {
          id: Date.now().toString(),
          name: projectData.name,
          clientId: projectData.clientId,
          status: projectData.status,
          deadline: projectData.deadline,
          progress: 0,
          tasks: []
      };

      projects.push(newProject);
      this.saveProjects(projects);
      return newProject;
  }


  // Delete project (client action)
  // Only the client that owns the project may delete it via this method.
  async deleteProject(projectId: string, actor?: { id: string, role: 'admin' | 'client' }): Promise<Project[]> {
    await delay(300);
    const projects = this.getStoredProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return projects;

    const project = projects[idx];

    // Admins are allowed to delete any project (for management purposes).
    if (actor && actor.role === 'admin') {
      console.log('[MockApi] Admin deleting project', projectId);
      projects.splice(idx, 1);
      this.saveProjects(projects);

      // Also remove projectId references from bookings
      const bookings = this.getStoredBookings();
      let changed = false;
      for (let b of bookings) {
        if (b.projectId === projectId) {
          console.log('[MockApi] Found booking for deleted project', b.id, 'status', b.status);
          // Cancel any pending or confirmed bookings tied to this project
          if (b.status === 'confirmed' || b.status === 'pending') {
            const prev = b.status;
            b.status = 'cancelled';
            b.meetLink = undefined;
            console.log('[MockApi] Cancelled booking', b.id, 'status was', prev, 'due to project deletion');
          }
          // detach project reference
          b.projectId = undefined;
          changed = true;
        }
      }
      if (changed) {
        console.log('[MockApi] Saving bookings after project deletion');
        this.saveBookings(bookings);
      }

      return projects;
    }

    // Non-admin: enforce client ownership and protections
    if (!actor || actor.role !== 'client' || actor.id !== project.clientId) {
      throw new Error('Only the client who owns this project may delete it via this endpoint');
    }

    // Only allow deleting projects that are still in Planning state.
    if (project.status !== 'Planning') {
      throw new Error('Only projects in Planning can be deleted. Projects that are in progress or completed are protected.');
    }

    // Prevent deletion if there are active bookings associated with this project
    const storedBookings = this.getStoredBookings();
    const hasActiveBooking = storedBookings.some(b => b.projectId === projectId && b.status !== 'rejected');
    if (hasActiveBooking) {
      throw new Error('This project has associated bookings and cannot be deleted.');
    }

    projects.splice(idx, 1);
    this.saveProjects(projects);

    // Also remove projectId references from bookings
    const bookings = this.getStoredBookings();
    let changed = false;
    for (let b of bookings) {
      if (b.projectId === projectId) {
        b.projectId = undefined;
        changed = true;
      }
    }
    if (changed) this.saveBookings(bookings);

    return projects;
  }

  // Rename a project. Admins can rename any project; clients can rename their own projects.
  async renameProject(projectId: string, newName: string, actor?: { id: string, role: 'admin' | 'client' }): Promise<Project[]> {
    await delay(300);
    if (!newName || !newName.trim()) throw new Error('Project name cannot be empty');
    const projects = this.getStoredProjects();
    const pIndex = projects.findIndex(p => p.id === projectId);
    if (pIndex === -1) throw new Error('Project not found');

    const project = projects[pIndex];

    // Permission check
    if (!(actor && (actor.role === 'admin' || (actor.role === 'client' && actor.id === project.clientId)))) {
      throw new Error('You do not have permission to rename this project');
    }

    // Prevent duplicate name for same client
    const dup = projects.find(p => p.clientId === project.clientId && p.name.toLowerCase() === newName.toLowerCase() && p.id !== projectId);
    if (dup) throw new Error('A project with that name already exists for this client');

    projects[pIndex] = { ...project, name: newName };
    this.saveProjects(projects);
    return projects;
  }

  // Note: Admin create/delete helpers removed to ensure only clients can create/delete their own projects.

  async getProjects(userId: string, role: 'admin' | 'client'): Promise<Project[]> {
    await delay(500);
    const allProjects = this.getStoredProjects();
    if (role === 'admin') return allProjects;
    return allProjects.filter(p => p.clientId === userId);
  }

  async toggleTaskCompletion(projectId: string, taskId: string): Promise<Project[]> {
    await delay(300);
    const projects = this.getStoredProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const project = projects[projectIndex];
    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    project.tasks[taskIndex].completed = !project.tasks[taskIndex].completed;
    
    // Calc progress
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.completed).length;
    project.progress = Math.round((completed / total) * 100);

    projects[projectIndex] = project;
    this.saveProjects(projects);
    return projects; // Returns all projects, logic in UI should filter
  }

  async addTask(projectId: string, title: string): Promise<Project[]> {
      await delay(300);
      const projects = this.getStoredProjects();
      const pIndex = projects.findIndex(p => p.id === projectId);
      if (pIndex === -1) throw new Error('Project not found');
      
      projects[pIndex].tasks.push({
          id: Date.now().toString(),
          title,
          completed: false,
          assignee: 'Unassigned'
      });
      this.saveProjects(projects);
      return projects;
  }

  // --- Bookings ---

  private getStoredBookings(): Booking[] {
    const stored = localStorage.getItem('nexus_bookings');
    return stored ? JSON.parse(stored) : [];
  }

  private saveBookings(bookings: Booking[]) {
    localStorage.setItem('nexus_bookings', JSON.stringify(bookings));
  }

  async createBooking(details: { userId: string, name: string; email: string; date: string; time: string, topic: string[], description: string, projectId?: string }): Promise<Booking> {
    await delay(1500);
    const bookings = this.getStoredBookings();
    
    // Check for conflicts (date + time)
    const isOccupied = bookings.some(b => 
      b.date === details.date && 
      b.time === details.time && 
      (b.status === 'pending' || b.status === 'confirmed')
    );

    if (isOccupied) {
        throw new Error("This time slot is no longer available. Please select another.");
    }
    
    const newBooking: Booking = {
        id: Date.now().toString(),
        userId: details.userId,
        userName: details.name,
        userEmail: details.email,
        date: details.date,
        time: details.time,
        topic: details.topic,
        description: details.description,
        status: 'pending',
        meetLink: undefined,
        projectId: details.projectId 
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  }

  // New method to fetch all occupied slots for the calendar
  async getOccupiedSlots(): Promise<{date: string, time: string}[]> {
      await delay(500);
      const bookings = this.getStoredBookings();
    // Only pending or confirmed bookings occupy slots
    return bookings
      .filter(b => b.status === 'pending' || b.status === 'confirmed')
      .map(b => ({ date: b.date, time: b.time }));
  }

  async getBookings(userId: string, role: 'admin' | 'client'): Promise<Booking[]> {
    await delay(600);
    // Before returning, auto-finish any confirmed bookings whose date/time have passed
    const bookings = this.getStoredBookings();
    const now = new Date();
    let changed = false;
    for (let b of bookings) {
      if (b.status === 'confirmed') {
        // try to parse date and time (expecting YYYY-MM-DD and HH:mm)
        try {
          const dt = new Date(`${b.date}T${b.time}:00`);
          if (!isNaN(dt.getTime()) && dt.getTime() <= now.getTime()) {
            b.status = 'finished';
            changed = true;
          }
        } catch (e) { /* ignore parse errors */ }
      }
    }
    if (changed) this.saveBookings(bookings);

    if (role === 'admin') return bookings;
    return bookings.filter(b => b.userId === userId);
  }

  // Clear booking history entries with status 'cancelled' or 'rejected'.
  // - If called by a client, only clears that client's cancelled/rejected bookings.
  // - If called by an admin without a userId, clears cancelled/rejected bookings globally.
  // - If called by an admin with a userId, clears cancelled/rejected bookings for that user.
  async clearBookingHistory(
    userId?: string,
    actor?: { id: string, role: 'admin' | 'client' },
    options?: { includeFinished?: boolean }
  ): Promise<Booking[]> {
    await delay(400);
    const bookings = this.getStoredBookings();

    if (!actor) throw new Error('Unauthorized');

    const includeFinished = !!options?.includeFinished;
    const statusesToRemove: string[] = ['cancelled', 'rejected'];
    if (includeFinished) statusesToRemove.push('finished');

    let remaining: Booking[] = [];

    if (actor.role === 'admin') {
      if (userId) {
        // Remove matching statuses for specific user
        remaining = bookings.filter(b => !(b.userId === userId && statusesToRemove.includes(b.status as any)));
      } else {
        // Remove matching statuses across all users
        remaining = bookings.filter(b => !statusesToRemove.includes(b.status as any));
      }
    } else {
      // client: only allow clearing their own matching-status bookings
      if (actor.id !== userId) throw new Error('You may only clear your own history');
      remaining = bookings.filter(b => !(b.userId === actor.id && statusesToRemove.includes(b.status as any)));
    }

    this.saveBookings(remaining);
    return remaining;
  }

  async confirmBooking(bookingId: string): Promise<Booking[]> {
      await delay(800);
      const bookings = this.getStoredBookings();
      const idx = bookings.findIndex(b => b.id === bookingId);
      if (idx === -1) throw new Error('Booking not found');

      // GENERATE UNIQUE LINK FOR THIS BOOKING
      bookings[idx].status = 'confirmed';
      bookings[idx].meetLink = generateUniqueMeetLink();

      console.log(`[Mock Email Service] Sending confirmation to ${bookings[idx].userEmail} with link ${bookings[idx].meetLink}`);

      this.saveBookings(bookings);
      return bookings;
  }

  async rejectBooking(bookingId: string): Promise<Booking[]> {
      await delay(500);
      const bookings = this.getStoredBookings();
      const idx = bookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
          bookings[idx].status = 'rejected';
          this.saveBookings(bookings);
      }
      return bookings;
  }

  // Cancel booking (admin can cancel any booking; client can cancel own booking)
  async cancelBooking(bookingId: string, actor?: { id: string, role: 'admin' | 'client' }): Promise<Booking[]> {
    await delay(400);
    const bookings = this.getStoredBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');

    const booking = bookings[idx];
    if (actor && actor.role === 'admin') {
      // Admin can cancel any booking
      booking.status = 'cancelled';
      booking.meetLink = undefined;
    } else {
      // Client may cancel their own bookings
      if (!actor || actor.id !== booking.userId) throw new Error('You do not have permission to cancel this booking');
      booking.status = 'cancelled';
      booking.meetLink = undefined;
    }
    this.saveBookings(bookings);
    return bookings;
  }

  // Admin marks booking as finished manually
  async finishBooking(bookingId: string, actor?: { id: string, role: 'admin' | 'client' }): Promise<Booking[]> {
    await delay(400);
    const bookings = this.getStoredBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    if (!actor || actor.role !== 'admin') throw new Error('Only admins may mark bookings as finished');
    bookings[idx].status = 'finished';
    this.saveBookings(bookings);
    return bookings;
  }
}

export const api = new MockApi();
