
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
        const admin: User = { id: 'admin1', name: 'NOVALIS AI Admin', email: 'admin@novalis-ai.dev', role: 'admin' };
        this.saveUsers([admin]);
        return [admin];
    }
    return JSON.parse(stored);
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('nexus_users', JSON.stringify(users));
  }

  // Public method for Admin Dashboard to list users
  async getAllUsers(roleFilter?: 'client' | 'developer'): Promise<User[]> {
      await delay(500);
      const users = this.getUsers();
      if (roleFilter) {
        return users.filter(u => u.role === roleFilter);
      }
      return users;
  }

  async login(email: string): Promise<User> {
    await delay(800);
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // For demo purposes, we accept any password, but check email existence
    if (!user) throw new Error('User not found. Please sign up.');
    // Block login for users that are pending or rejected (only for clients, not developers)
    if (user.role === 'client') {
      if ((user as any).status === 'pending') throw new Error('Your account is pending approval by an administrator.');
      if ((user as any).status === 'rejected') throw new Error('Your account registration was rejected.');
    }
    // Developers created by admin are always approved
    return user;
  }

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
    // Notify all admins about the new pending signup
    try {
      const admins = this.getUsers().filter(u => u.role === 'admin');
      for (const a of admins) {
        // fire-and-forget
        this.createNotification(a.id, 'New signup pending', `${name} (${email}) signed up and is pending approval.`).catch(() => {});
      }
    } catch (e) {
      // ignore notification failures
    }
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

  // --- Developer Management (Admin only) ---

  async createDeveloper(name: string, email: string): Promise<User> {
    await delay(600);
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const newDeveloper: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'developer',
      status: 'approved' // Developers created by admin are auto-approved
    };
    users.push(newDeveloper);
    this.saveUsers(users);
    return newDeveloper;
  }

  async updateDeveloper(developerId: string, updates: { name?: string; email?: string }): Promise<User[]> {
    await delay(400);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === developerId && u.role === 'developer');
    if (idx === -1) throw new Error('Developer not found');

    if (updates.email) {
      const emailExists = users.find(u => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== developerId);
      if (emailExists) throw new Error('Email already in use');
      users[idx].email = updates.email;
    }
    if (updates.name) {
      users[idx].name = updates.name;
    }

    this.saveUsers(users);
    return users.filter(u => u.role === 'developer');
  }

  async deleteDeveloper(developerId: string): Promise<User[]> {
    await delay(300);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === developerId && u.role === 'developer');
    if (idx !== -1) {
      users.splice(idx, 1);
      this.saveUsers(users);

      // Remove developer assignment from projects
      const projects = this.getStoredProjects();
      let changed = false;
      for (const p of projects) {
        if (p.developerId === developerId) {
          p.developerId = undefined;
          changed = true;
        }
      }
      if (changed) this.saveProjects(projects);
    }
    return users.filter(u => u.role === 'developer');
  }

  // Assign a developer to a project (Admin only)
  async assignDeveloperToProject(projectId: string, developerId: string | null): Promise<Project[]> {
    await delay(400);
    const projects = this.getStoredProjects();
    const pIdx = projects.findIndex(p => p.id === projectId);
    if (pIdx === -1) throw new Error('Project not found');

    if (developerId) {
      const users = this.getUsers();
      const developer = users.find(u => u.id === developerId && u.role === 'developer');
      if (!developer) throw new Error('Developer not found');
    }

    projects[pIdx].developerId = developerId || undefined;
    this.saveProjects(projects);
    return projects;
  }

  // Get projects for a developer
  async getDeveloperProjects(developerId: string): Promise<Project[]> {
    await delay(500);
    const allProjects = this.getStoredProjects();
    return allProjects.filter(p => p.developerId === developerId);
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
    actor?: { id: string, role: 'admin' | 'client' | 'developer' }
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

      // Notify admins about the new project
      try {
        const admins = this.getUsers().filter(u => u.role === 'admin');
        for (const a of admins) {
          this.createNotification(a.id, 'New project created', `Project "${newProject.name}" was created by ${newProject.clientId}.`).catch(() => {});
        }
      } catch (e) {
        // ignore
      }
      return newProject;
  }


  // Delete project (client action)
  // Only the client that owns the project may delete it via this method.
  async deleteProject(projectId: string, actor?: { id: string, role: 'admin' | 'client' | 'developer' }): Promise<Project[]> {
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
  async renameProject(projectId: string, newName: string, actor?: { id: string, role: 'admin' | 'client' | 'developer' }): Promise<Project[]> {
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

  // Update project details (description, services, features)
  async updateProjectDetails(
    projectId: string, 
    details: { description?: string; services?: string[]; features?: string[] },
    actor?: { id: string, role: 'admin' | 'client' | 'developer' }
  ): Promise<Project[]> {
    await delay(300);
    const projects = this.getStoredProjects();
    const pIndex = projects.findIndex(p => p.id === projectId);
    if (pIndex === -1) throw new Error('Project not found');

    const project = projects[pIndex];

    // Only client who owns the project or admin can update details
    if (!(actor && (actor.role === 'admin' || (actor.role === 'client' && actor.id === project.clientId)))) {
      throw new Error('You do not have permission to update this project');
    }

    projects[pIndex] = { 
      ...project, 
      description: details.description !== undefined ? details.description : project.description,
      services: details.services !== undefined ? details.services : project.services,
      features: details.features !== undefined ? details.features : project.features
    };
    this.saveProjects(projects);
    return projects;
  }

  // Note: Admin create/delete helpers removed to ensure only clients can create/delete their own projects.

  async getProjects(userId: string, role: 'admin' | 'client' | 'developer'): Promise<Project[]> {
    await delay(500);
    const allProjects = this.getStoredProjects();
    if (role === 'admin') return allProjects;
    if (role === 'developer') return allProjects.filter(p => p.developerId === userId);
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
    
    // Calc progress (avoid division by zero)
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.completed).length;
    project.progress = total > 0 ? Math.round((completed / total) * 100) : 0;

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

  async reorderTasks(projectId: string, fromIndex: number, toIndex: number): Promise<Project[]> {
      await delay(200);
      const projects = this.getStoredProjects();
      const pIndex = projects.findIndex(p => p.id === projectId);
      if (pIndex === -1) throw new Error('Project not found');
      
      const tasks = [...projects[pIndex].tasks];
      const [movedTask] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, movedTask);
      projects[pIndex].tasks = tasks;
      
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

    // Notify admins about the new booking
    try {
      const admins = this.getUsers().filter(u => u.role === 'admin');
      for (const a of admins) {
        this.createNotification(a.id, 'New booking', `${details.name} requested a booking on ${details.date} at ${details.time}.`).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
    return newBooking;
  }

  // Demo booking for new users without login/signup
  async createDemoBooking(details: { 
    name: string; 
    email: string; 
    company?: string;
    phone?: string;
    date: string; 
    time: string; 
    message: string 
  }): Promise<Booking> {
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
    
    // Create a demo booking with a special demo user ID
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: 'demo_' + Date.now().toString(), // Special demo user ID
      userName: details.name,
      userEmail: details.email,
      date: details.date,
      time: details.time,
      topic: ['Demo Request'],
      description: `[DEMO REQUEST]${details.company ? ` Company: ${details.company}` : ''}${details.phone ? ` | Phone: ${details.phone}` : ''}\n\n${details.message}`,
      status: 'pending',
      meetLink: undefined,
      projectId: undefined
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);

    // Notify admins about the new demo booking
    try {
      const admins = this.getUsers().filter(u => u.role === 'admin');
      for (const a of admins) {
        this.createNotification(a.id, 'New Demo Request', `${details.name} (${details.email}) requested a demo on ${details.date} at ${details.time}.`).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
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

  async getBookings(userId: string, role: 'admin' | 'client' | 'developer'): Promise<Booking[]> {
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
    // Developers don't have bookings, but return empty for safety
    if (role === 'developer') return [];
    return bookings.filter(b => b.userId === userId);
  }

  // Clear booking history entries with status 'cancelled' or 'rejected'.
  // - If called by a client, only clears that client's cancelled/rejected bookings.
  // - If called by an admin without a userId, clears cancelled/rejected bookings globally.
  // - If called by an admin with a userId, clears cancelled/rejected bookings for that user.
  async clearBookingHistory(
    userId?: string,
    actor?: { id: string, role: 'admin' | 'client' | 'developer' },
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
      // Create an in-app notification for the user
      try {
        await this.createNotification(bookings[idx].userId, 'Booking confirmed', `Your meeting on ${bookings[idx].date} at ${bookings[idx].time} is confirmed.`);
      } catch (e) {
        console.warn('Failed to create in-app notification', e);
      }

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
  async cancelBooking(bookingId: string, actor?: { id: string, role: 'admin' | 'client' | 'developer' }): Promise<Booking[]> {
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
      // Client may cancel their own bookings, developers cannot cancel
      if (!actor || actor.id !== booking.userId || actor.role === 'developer') throw new Error('You do not have permission to cancel this booking');
      booking.status = 'cancelled';
      booking.meetLink = undefined;
    }
    this.saveBookings(bookings);
    return bookings;
  }

  // Admin marks booking as finished manually
  async finishBooking(bookingId: string, actor?: { id: string, role: 'admin' | 'client' | 'developer' }): Promise<Booking[]> {
    await delay(400);
    const bookings = this.getStoredBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    if (!actor || actor.role !== 'admin') throw new Error('Only admins may mark bookings as finished');
    bookings[idx].status = 'finished';
    this.saveBookings(bookings);
    return bookings;
  }

  // --- Notifications ---
  private getStoredNotifications() {
    const stored = localStorage.getItem('nexus_notifications');
    return stored ? JSON.parse(stored) : [];
  }

  private saveNotifications(notifications: any[]) {
    localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
    // Dispatch an event so UI components can react in real-time
    try {
      const evt = new CustomEvent('nexus:notifications-changed', { detail: { notifications } });
      window.dispatchEvent(evt as Event);
    } catch (e) {
      // ignore if running in non-browser env
    }
  }

  // Create a notification for a specific user (used by other methods to push updates)
  async createNotification(userId: string, title: string, body?: string, type?: string) {
    await delay(200);
    const notifications = this.getStoredNotifications();
    const n = {
      id: Date.now().toString(),
      userId,
      title,
      body: body || '',
      type: type || 'info',
      date: new Date().toISOString(),
      read: false,
    };
    notifications.push(n);
    this.saveNotifications(notifications);
    return n;
  }

  async getNotifications(userId?: string, role?: 'admin' | 'client' | 'developer') {
    await delay(300);
    const notifications = this.getStoredNotifications();
    // If caller is admin, return all notifications newest first
    if (role === 'admin') {
      return notifications.slice().sort((a: any,b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    // return only notifications for this user, newest first
    if (!userId) return [];
    return notifications.filter((n: any) => n.userId === userId).sort((a: any,b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async markNotificationRead(notificationId: string, userId?: string) {
    await delay(150);
    const notifications = this.getStoredNotifications();
    const idx = notifications.findIndex((n: any) => n.id === notificationId && (!userId || n.userId === userId));
    if (idx !== -1) {
      notifications[idx].read = true;
      this.saveNotifications(notifications);
    }
    return notifications.filter((n: any) => !userId || n.userId === userId);
  }

  // Set read state (true/false) for a notification
  async setNotificationRead(notificationId: string, read: boolean, userId?: string) {
    await delay(150);
    const notifications = this.getStoredNotifications();
    const idx = notifications.findIndex((n: any) => n.id === notificationId && (!userId || n.userId === userId));
    if (idx !== -1) {
      notifications[idx].read = !!read;
      this.saveNotifications(notifications);
    }
    return notifications.filter((n: any) => !userId || n.userId === userId);
  }

  // Delete a specific notification for a user
  async deleteNotification(notificationId: string, userId?: string) {
    await delay(120);
    let notifications = this.getStoredNotifications();
    const before = notifications.length;
    notifications = notifications.filter((n: any) => {
      if (userId) return !(n.id === notificationId && n.userId === userId);
      return n.id !== notificationId;
    });
    if (notifications.length !== before) this.saveNotifications(notifications);
    return notifications.filter((n: any) => !userId || n.userId === userId);
  }

  async markAllNotificationsRead(userId: string) {
    await delay(200);
    const notifications = this.getStoredNotifications();
    let changed = false;
    for (let n of notifications) {
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    }
    if (changed) this.saveNotifications(notifications);
    return notifications.filter((n: any) => n.userId === userId);
  }

  // Remove all notifications for a specific user
  async clearNotifications(userId?: string) {
    await delay(200);
    let notifications = this.getStoredNotifications();
    const before = notifications.length;
    if (userId) {
      notifications = notifications.filter((n: any) => n.userId !== userId);
    } else {
      // no userId => clear all notifications (admin action)
      notifications = [];
    }
    if (notifications.length !== before) this.saveNotifications(notifications);
    if (userId) return notifications.filter((n: any) => n.userId === userId);
    return [];
  }
}

export const api = new MockApi();
