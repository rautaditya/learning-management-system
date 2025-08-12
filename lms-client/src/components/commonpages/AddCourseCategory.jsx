import React, { useState, useRef, useEffect } from 'react';
import {
  createCourseCategory,
  getAllCourseCategories,
  updateCourseCategory,
  deleteCourseCategory,
} from '../../api/common';
import {
  Tag,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

const AddCourseCategory = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // For editing state
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getAllCourseCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const data = await createCourseCategory({ title: title.trim() });
      setMessage({ type: 'success', text: `Category "${data.title}" created successfully!` });
      setTitle('');
      fetchCategories(); // Refresh the list
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create category' });
    } finally {
      setLoading(false);
    }
  };

  // Start editing a category
  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setMessage(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  // Handle edit input change
  const onEditChange = (e) => {
    setEditingTitle(e.target.value);
  };

  // Submit update
  const submitUpdate = async (id) => {
    if (!editingTitle.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await updateCourseCategory(id, { title: editingTitle.trim() });
      setMessage({ type: 'success', text: 'Category updated successfully!' });
      setEditingId(null);
      setEditingTitle('');
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update category' });
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    setMessage(null);
    try {
      await deleteCourseCategory(id);
      setMessage({ type: 'success', text: 'Category deleted successfully!' });
      if (editingId === id) {
        cancelEditing();
      }
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete category' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter and Escape keys in edit input
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      submitUpdate(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Column - Add Form */}
      <div style={styles.column}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Course Category</h2>
          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <label htmlFor="categoryTitle" style={styles.label}>
              <Tag size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Category Title
            </label>
            <input
              id="categoryTitle"
              type="text"
              placeholder="Enter category title"
              value={title}
              ref={inputRef}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              style={{
                ...styles.input,
                borderColor: message?.type === 'error' ? '#dc3545' : '#ced4da',
              }}
              aria-invalid={message?.type === 'error' ? 'true' : 'false'}
              aria-describedby="categoryTitleError"
            />
            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
              aria-busy={loading}
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </form>

          {message && (
            <div
              id="categoryTitleError"
              role={message.type === 'error' ? 'alert' : 'status'}
              style={{
                ...styles.message,
                backgroundColor: message.type === 'error' ? '#f8d7da' : '#d1e7dd',
                color: message.type === 'error' ? '#842029' : '#0f5132',
                borderColor: message.type === 'error' ? '#f5c2c7' : '#badbcc',
              }}
            >
              {message.type === 'error' ? (
                <AlertTriangle size={16} style={{ marginRight: 6 }} />
              ) : (
                <CheckCircle2 size={16} style={{ marginRight: 6 }} />
              )}
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - List */}
      <div style={styles.column}>
        <div style={styles.card}>
          <h2 style={styles.title}>Course Categories</h2>
          {loadingCategories ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <ul style={styles.list}>
              {categories.map((cat) => (
                <li key={cat._id} style={styles.listItem}>
                  {editingId === cat._id ? (
                    <>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={onEditChange}
                        onKeyDown={(e) => handleEditKeyDown(e, cat._id)}
                        autoFocus
                        style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                        disabled={loading}
                      />
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => submitUpdate(cat._id)}
                          disabled={loading}
                          title="Save"
                          style={styles.iconButton}
                          aria-label="Save"
                        >
                          <Check size={18} color="#198754" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={loading}
                          title="Cancel"
                          style={styles.iconButton}
                          aria-label="Cancel"
                        >
                          <X size={18} color="#dc3545" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{cat.title}</span>
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => startEditing(cat._id, cat.title)}
                          title="Edit"
                          style={styles.iconButton}
                          aria-label="Edit"
                        >
                          <Pencil size={16} color="#0d6efd" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          title="Delete"
                          style={styles.iconButton}
                          aria-label="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={16} color="#dc3545" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  column: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    padding: '2rem',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#343a40',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px 12px',
    fontSize: 15,
    borderRadius: 4,
    border: '1px solid #ced4da',
    marginBottom: 16,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '10px 16px',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: 16,
    padding: '10px 12px',
    borderRadius: 4,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #dee2e6',
    fontSize: 15,
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
};

export default AddCourseCategory;
