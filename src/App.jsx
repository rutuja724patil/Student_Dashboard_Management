import { useState, useCallback } from 'react'
import {
  GraduationCap,
  Plus,
  Users,
  BookOpen,
  User as UserIcon,
  X as CloseIcon
} from 'lucide-react';
import useStudents from "../hooks/useStudent" // Ensure path is correct
import StudentList from '../components/StudentList' // Ensure path is correct
import StudentForm from '../components/StudentForm' // Ensure path is correct
import './App.css' // Or index.css if you prefer global styles there

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="h-screen w-64 bg-gray-900/90 border-r border-gray-800 shadow-xl flex flex-col justify-between fixed left-0 top-0 z-40">
    <div>
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="bg-purple-600 rounded-full p-2 shadow-lg">
          <GraduationCap size={28} className="text-white" />
        </span>
        <span className="text-xl font-extrabold text-gray-100 tracking-tight">StudentDash</span>
      </div>
      <nav className="mt-8 space-y-2 px-4">
        <button
          onClick={() => setActiveTab('students')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'students' ? 'text-purple-300 bg-gray-800' : 'text-gray-400 hover:bg-gray-800 hover:text-purple-300'
          }`}
        >
          <Users size={18} /> Students
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'courses' ? 'text-purple-300 bg-gray-800' : 'text-gray-400 hover:bg-gray-800 hover:text-purple-300'
          }`}
        >
          <BookOpen size={18} /> Courses
        </button>
      </nav>
    </div>
    <div className="flex items-center gap-3 px-6 py-6 border-t border-gray-800">
      <img src="https://th.bing.com/th/id/OIP.917x0654Lg6G_M5HMJbt2wHaHb?pid=ImgDet&w=184&h=185&c=7&dpr=1.3&cb=idpwebp2&o=7&rm=3" alt="User" className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover" />
      <div>
        <div className="font-semibold text-gray-100">Rutuja</div>
        <div className="text-xs text-gray-400">Rutuja@school.com</div>
      </div>
    </div>
  </aside>
);

// StatCard Component
const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-800/80 rounded-xl shadow p-4 border border-gray-700 min-w-[140px]">
    <span className="bg-purple-800/50 text-purple-300 rounded-full p-2">
      {icon}
    </span>
    <div>
      <div className="text-lg font-bold text-gray-100">{value}</div>
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

// Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in border border-gray-700">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-purple-400 transition">
          <CloseIcon size={22} />
        </button>
        {children}
      </div>
    </div>
  );
};

// CourseCards Component
const CourseCards = ({ courses }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
    {courses.map(course => (
      <div key={course.id} className="bg-gray-800/90 rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
        <BookOpen size={40} className="text-purple-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-100 mb-2">{course.name}</h3>
        <p className="text-gray-400 text-sm mb-2">Course ID: <span className="font-mono text-purple-300">{course.id}</span></p>
        {course.description && <p className="text-gray-400 text-sm mt-2">{course.description}</p>}
      </div>
    ))}
  </div>
);

// Main App Component
const App = () => {
  const {
    students,
    courses,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents
  } = useStudents();

  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('students');

  // Show notification with auto-dismiss
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // Handle adding new student
  const handleAddStudent = useCallback(async (studentData) => {
    try {
      await addStudent(studentData);
      setShowForm(false);
      setEditingStudent(null);
      showNotification('Student added successfully!');
    } catch (err) {
      showNotification('Failed to add student', 'error');
    }
  }, [addStudent, showNotification]);

  // Handle updating student
  const handleUpdateStudent = useCallback(async (studentData) => {
    try {
      await updateStudent(editingStudent.id, studentData);
      setShowForm(false);
      setEditingStudent(null);
      showNotification('Student updated successfully!');
    } catch (err) {
      showNotification('Failed to update student', 'error');
    }
  }, [updateStudent, editingStudent, showNotification]);

  // Handle deleting student
  const handleDeleteStudent = useCallback(async (studentId) => {
    try {
      await deleteStudent(studentId);
      showNotification('Student deleted successfully!');
    } catch (err) {
      showNotification('Failed to delete student', 'error');
    }
  }, [deleteStudent, showNotification]);

  // Handle edit button click
  const handleEditStudent = useCallback((student) => {
    setEditingStudent(student);
    setShowForm(true);
  }, []);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingStudent(null);
    setShowForm(false);
  }, []);

  // Dashboard stats
  const stats = [
    { icon: <Users size={20} />, label: 'Students', value: students.length },
    { icon: <BookOpen size={20} />, label: 'Courses', value: courses.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex"> {/* Dark gradient background */}
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main content area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur shadow flex items-center justify-between px-8 py-4 border-b border-gray-800">
          <h1 className="text-2xl font-extrabold text-gray-100 tracking-tight drop-shadow">{activeTab === 'students' ? 'Students' : 'Courses'}</h1>
          {activeTab === 'students' && (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:scale-105 hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200"
              onClick={() => {
                setShowForm(true);
                setEditingStudent(null);
              }}
            >
              <Plus size={20} /> Add Student
            </button>
          )}
        </header>
        {/* Dashboard stats */}
        {activeTab === 'students' && (
          <section className="px-8 py-6 flex flex-wrap gap-6"> {/* Added flex-wrap for responsiveness */}
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </section>
        )}
        {/* Notification */}
        {notification && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded mb-6 mx-8 text-white shadow-lg transition-all duration-300 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.type === 'success' ? <GraduationCap size={20} /> : <GraduationCap size={20} />}
            <span>{notification.message}</span>
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded mb-6 mx-8 bg-red-600 text-white shadow-lg">
            <GraduationCap size={20} />
            <span>{error}</span>
            <button
              className="ml-auto underline text-white hover:text-gray-200"
              onClick={refreshStudents}
            >
              Retry
            </button>
          </div>
        )}
        {/* Main Content: Student List as table or Courses as cards */}
        <main className="flex-1 px-8 pb-10">
          {activeTab === 'students' ? (
            <StudentList
              students={students}
              courses={courses}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              loading={loading.students}
              tableView={true}
            />
          ) : (
            <CourseCards courses={courses} />
          )}
        </main>
      </div>
      {/* Student Form Modal */}
      <Modal open={showForm} onClose={handleCancelEdit}>
        <StudentForm
          student={editingStudent}
          courses={courses}
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={handleCancelEdit}
          loading={loading.action}
        />
      </Modal>
      {/* Fade-in animation keyframes (can be in index.css if preferred) */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default App;