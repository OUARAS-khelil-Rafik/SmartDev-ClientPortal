
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
    return user;
  }

  async loginWithGoogle(): Promise<User> {
      await delay(1000); // Simulate popup and OAuth delay
      const users = this.getUsers();
      
      // Simulate a Google User
      const googleEmail = "user.demo@gmail.com";
      let user = users.find(u => u.email === googleEmail);
      
      if (!user) {
          // Auto-register if first time
          user = {
              id: `google_${Date.now()}`,
              name: "Google User",
              email: googleEmail,
              role: 'client',
              avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c' // Generic Google avatar
          };
          users.push(user);
          this.saveUsers(users);
          await this.createDemoProjectForUser(user.id);
      }
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
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    // Assign a demo project to new user
    await this.createDemoProjectForUser(newUser.id);
    
    return newUser;
  }

  // --- Projects ---

  private getStoredProjects(): Project[] {
    const stored = localStorage.getItem('nexus_projects');
    return stored ? JSON.parse(stored) : [];
  }

  private saveProjects(projects: Project[]) {
    localStorage.setItem('nexus_projects', JSON.stringify(projects));
  }

  private async createDemoProjectForUser(userId: string) {
    const projects = this.getStoredProjects();
    const newProject: Project = {
        id: Date.now().toString(),
        name: 'My First Project',
        clientId: userId,
        status: 'Planning',
        progress: 10,
        deadline: '2025-01-01',
        tasks: [
            { id: 't1', title: 'Initial Consultation', completed: false, assignee: 'Nexus Team' },
            { id: 't2', title: 'Requirements Gathering', completed: false, assignee: 'Nexus Team' }
        ]
    };
    projects.push(newProject);
    this.saveProjects(projects);
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
    if (!actor || actor.role !== 'client' || actor.id !== project.clientId) {
      throw new Error('Only the client who owns this project may delete it via this endpoint');
    }

    // Only allow deleting projects that are still in Planning state.
    // If the project has moved beyond 'Planning' (e.g., In Progress, Review, Completed) it is considered protected.
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
        b.status !== 'rejected'
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
      // Filter out rejected bookings, as those slots are free again
      return bookings
        .filter(b => b.status !== 'rejected')
        .map(b => ({ date: b.date, time: b.time }));
  }

  async getBookings(userId: string, role: 'admin' | 'client'): Promise<Booking[]> {
    await delay(600);
    const all = this.getStoredBookings();
    if (role === 'admin') return all;
    return all.filter(b => b.userId === userId);
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
}

export const api = new MockApi();
