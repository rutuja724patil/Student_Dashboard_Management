import { useCallback, useState, useEffect } from "react";
import MockAPI from '../server/api';

const useStudents = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState({ students: false, courses: false, action: false });
    const [error, setError] = useState(null);
  
    // Load students on component mount
    useEffect(() => {
      loadStudents();
      loadCourses();
    }, []);
  
    const loadStudents = useCallback(async () => {
      setLoading(prev => ({ ...prev, students: true }));
      setError(null);
      
      try {
        const data = await MockAPI.getStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to load students: ' + err.message);
      } finally {
        setLoading(prev => ({ ...prev, students: false }));
      }
    }, []);
  
    const loadCourses = useCallback(async () => {
      setLoading(prev => ({ ...prev, courses: true }));
      
      try {
        const data = await MockAPI.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(prev => ({ ...prev, courses: false }));
      }
    }, []);
  
    const addStudent = useCallback(async (studentData) => {
      setLoading(prev => ({ ...prev, action: true }));
      setError(null);
      
      try {
        const newStudent = await MockAPI.createStudent(studentData);
        setStudents(prev => [...prev, newStudent]);
        return newStudent;
      } catch (err) {
        setError('Failed to add student: ' + err.message);
        throw err;
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    }, []);
  
    const updateStudent = useCallback(async (id, updatedData) => {
      setLoading(prev => ({ ...prev, action: true }));
      setError(null);
      
      try {
        const updatedStudent = await MockAPI.updateStudent(id, updatedData);
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
        return updatedStudent;
      } catch (err) {
        setError('Failed to update student: ' + err.message);
        throw err;
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    }, []);
  
    const deleteStudent = useCallback(async (id) => {
      setLoading(prev => ({ ...prev, action: true }));
      setError(null);
      
      try {
        await MockAPI.deleteStudent(id);
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        setError('Failed to delete student: ' + err.message);
        throw err;
      } finally {
        setLoading(prev => ({ ...prev, action: false }));
      }
    }, []);
  
    return {
      students,
      courses,
      loading,
      error,
      addStudent,
      updateStudent,
      deleteStudent,
      refreshStudents: loadStudents
    };
  };

export default useStudents;