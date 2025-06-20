import { BookOpen, Mail, Save, User, X } from "lucide-react";
import { useCallback, useState } from "react";

const StudentForm = ({ student, courses, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    course: student?.course || '',
    profileImage: student?.profileImage || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focus, setFocus] = useState({});

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'course':
        return !value ? 'Please select a course' : '';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFocus(prev => ({ ...prev, [name]: false }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleFocus = useCallback((e) => {
    const { name } = e.target;
    setFocus(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'profileImage') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, course: true });

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(formData);
        if (!student) {
          setFormData({ name: '', email: '', course: '', profileImage: '' });
          setTouched({});
          setErrors({});
        }
      } catch (err) {
        // Error handled by parent
      }
    }
  }, [formData, validateField, onSubmit, student]);

  const getLabelClass = (field, extra = "") =>
    "absolute left-4 transition-all pointer-events-none " +
    ((focus[field] || formData[field])
      ? "-top-3 text-xs text-purple-400 bg-gray-900 px-1 " + extra // Adjusted for dark theme
      : "top-2 text-sm text-gray-400 " + extra); // Adjusted for dark theme

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-xl mx-auto space-y-6" // Adjusted for dark theme
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 flex items-center justify-center rounded-full text-white ${student ? 'bg-purple-600' : 'bg-purple-700'} shadow-md`}> {/* Adjusted for dark theme */}
          <User size={18} />
        </div>
        <h2 className="text-2xl font-bold text-gray-100"> {/* Adjusted for dark theme */}
          {student ? 'Edit Student' : 'Add New Student'}
        </h2>
      </div>

      {/* Name Field */}
      <div className="relative">
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={loading}
          className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-gray-700/50 text-gray-100 outline-none focus:ring-2 focus:ring-purple-400 transition-all ${errors.name ? 'border-red-500' : 'border-gray-600'}`} // Adjusted for dark theme
          placeholder=" "
        />
        <label htmlFor="name" className={getLabelClass('name')}>
          <User size={14} className="inline mr-1" /> Name *
        </label>
        {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>} {/* Adjusted for dark theme */}
      </div>

      {/* Email Field */}
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={loading}
          className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-gray-700/50 text-gray-100 outline-none focus:ring-2 focus:ring-purple-400 transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'}`} // Adjusted for dark theme
          placeholder=" "
        />
        <label htmlFor="email" className={getLabelClass('email')}>
          <Mail size={14} className="inline mr-1" /> Email *
        </label>
        {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>} {/* Adjusted for dark theme */}
      </div>

      {/* Course Select */}
      <div className="relative">
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={loading}
          className={`peer w-full px-4 pt-6 pb-2 rounded-lg border bg-gray-700/50 text-gray-100 appearance-none outline-none focus:ring-2 focus:ring-purple-400 transition-all ${errors.course ? 'border-red-500' : 'border-gray-600'}`} // Adjusted for dark theme
        >
          <option value="" disabled hidden className="bg-gray-800 text-gray-300">Select a course</option> {/* Adjusted for dark theme */}
          {courses.map(course => (
            <option key={course.id} value={course.name} className="bg-gray-800 text-gray-100"> {/* Adjusted for dark theme */}
              {course.name}
            </option>
          ))}
        </select>
        <label htmlFor="course" className={getLabelClass('course')}>
          <BookOpen size={14} className="inline mr-1" /> Course *
        </label>
        {errors.course && <p className="text-sm text-red-400 mt-1">{errors.course}</p>} {/* Adjusted for dark theme */}
      </div>

      {/* Profile Image */}
      <div className="relative">
        <input
          id="profileImage"
          name="profileImage"
          type="url"
          value={formData.profileImage}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder=" "
          disabled={loading}
          className="peer w-full px-4 pt-6 pb-2 border border-gray-600 rounded-lg bg-gray-700/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" // Adjusted for dark theme
          autoComplete="off"
        />
        <label htmlFor="profileImage" className={getLabelClass('profileImage')}>
          <User size={14} className="inline mr-1" /> Profile Image URL (Optional)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-lg transition-all disabled:opacity-50" // Adjusted for dark theme
        >
          {loading ? "Loading..." : <>
            <Save size={16} /> {student ? "Update" : "Add"} Student
          </>}
        </button>
        {student && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-700 text-gray-200 px-5 py-2 rounded-lg shadow hover:bg-gray-600 transition" // Adjusted for dark theme
          >
            <X size={16} /> Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;