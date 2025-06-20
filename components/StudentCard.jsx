import { BookOpen, Edit3, Mail, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

const StudentCard = ({ student, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(student.id);
      } catch (err) {
        // Error handled by parent
      } finally {
        setIsDeleting(false);
      }
    }
  }, [student.id, student.name, onDelete]);

  return (
    <div className="flex items-center gap-6 bg-gray-800/60 backdrop-blur-md shadow-lg border border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all duration-300 max-w-3xl w-full">
      {/* Profile Image */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-400 flex-shrink-0 shadow-md">
        <img
          src={student.profileImage}
          alt={student.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=8b5cf6&color=ffffff&size=150`; // Adjusted background to match purple theme
          }}
        />
      </div>

      {/* Info Section */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-100 mb-1">{student.name}</h3>
        <p className="flex items-center text-sm text-gray-300 mb-2">
          <Mail className="mr-1 text-purple-300" size={16} /> {student.email}
        </p>
        <p className="inline-flex items-center bg-purple-700/50 text-purple-200 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
          <BookOpen size={14} className="mr-1" />
          {student.course}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={() => onEdit(student)}
          title="Edit student"
          className="bg-purple-900/50 hover:bg-purple-800/70 text-purple-300 p-2 rounded-full transition-all"
        >
          <Edit3 size={18} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete student"
          className="bg-red-900/50 hover:bg-red-800/70 text-red-300 p-2 rounded-full transition-all disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default StudentCard;