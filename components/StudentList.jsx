import { useMemo, useState } from "react";
import { Users, Search, Edit3, Trash2 } from "lucide-react";
import StudentCard from "./StudentCard"; // Ensure this path is correct based on your structure

const StudentList = ({ students, courses, onEdit, onDelete, loading, tableView }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = !selectedCourse || student.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [students, searchTerm, selectedCourse]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-2"></div>
        <p className="text-gray-400">Loading students...</p>
      </div>
    );
  }

  const renderSearchAndFilter = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100 drop-shadow">
        <Users size={22} className="text-purple-400" />
        Students{" "}
        <span className="text-gray-400 font-normal">({filteredStudents.length})</span>
      </h2>
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <div className="relative w-full md:w-auto">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/70 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm w-full md:w-56"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-800/70 text-gray-200 shadow-sm"
        >
          <option value="" className="bg-gray-800 text-gray-300">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name} className="bg-gray-800 text-gray-100">
              {course.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  if (tableView) {
    return (
      <div className="bg-gray-900/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 p-6 overflow-x-auto">
        {renderSearchAndFilter()}
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Users size={48} className="text-gray-600" />
            <h3 className="text-lg font-semibold mt-2 text-gray-300">No students found</h3>
            <p className="text-sm mt-1 text-center text-gray-400">
              {searchTerm || selectedCourse
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first student"}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                  Avatar
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                  Course
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <img
                      src={
                        student.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.name
                        )}&background=8b5cf6&color=ffffff&size=150`
                      }
                      alt={student.name}
                      className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.name
                        )}&background=8b5cf6&color=ffffff&size=150`;
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-100">{student.name}</td>
                  <td className="px-4 py-3 text-gray-300">{student.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-800/50 text-purple-200 text-xs font-semibold shadow">
                      {student.course}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onEdit(student)}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-purple-900/50 hover:bg-purple-800/70 text-purple-300 mr-2 transition"
                      title="Edit student"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-red-900/50 hover:bg-red-800/70 text-red-300 transition"
                      title="Delete student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-gray-900/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700 p-6">
      {renderSearchAndFilter()}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Users size={48} className="text-gray-600" />
          <h3 className="text-lg font-semibold mt-2 text-gray-300">No students found</h3>
          <p className="text-sm mt-1 text-center text-gray-400">
            {searchTerm || selectedCourse
              ? "Try adjusting your search or filter criteria"
              : "Start by adding your first student"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              courses={courses} // Note: 'courses' prop is not used in StudentCard currently, but keeping it if future changes require it.
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;