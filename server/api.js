class MockAPI {
    // Simulated database
    static students = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "React In Depth", profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b765?w=150&h=150&fit=crop&crop=face" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", course: "JavaScript Pro", profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { id: 3, name: "Carol Davis", email: "carol@example.com", course: "CSS Mastery", profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
    ];
  
    static courses = [
      { id: 1, name: "HTML Basics" },
      { id: 2, name: "CSS Mastery" },
      { id: 3, name: "JavaScript Pro" },
      { id: 4, name: "React In Depth" }
    ];
  
    // Simulate network delay to demonstrate async/await and loading states
    static delay(ms = 800) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // GET all students
    static async getStudents() {
      await this.delay(600);
      // Simulate potential network error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch students');
      }
      return [...this.students];
    }
  
    // GET all courses
    static async getCourses() {
      await this.delay(400);
      return [...this.courses];
    }
  
    // POST new student
    static async createStudent(studentData) {
      await this.delay(500);
      const newStudent = {
        ...studentData,
        id: Math.max(...this.students.map(s => s.id), 0) + 1,
        profileImage: studentData.profileImage || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`
      };
      this.students.push(newStudent);
      return newStudent;
    }
  
    // PUT update student
    static async updateStudent(id, updatedData) {
      await this.delay(500);
      const index = this.students.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Student not found');
      
      this.students[index] = { ...this.students[index], ...updatedData };
      return this.students[index];
    }
  
    // DELETE student
    static async deleteStudent(id) {
      await this.delay(300);
      const index = this.students.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Student not found');
      
      const deletedStudent = this.students.splice(index, 1)[0];
      return deletedStudent;
    }
  }
  
export default MockAPI;
  