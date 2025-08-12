import React, { useState, useRef } from 'react';
import { createCourseCategory } from '../../api/common';
import { Tag, CheckCircle2, AlertTriangle } from 'lucide-react';

const AddCourseCategory = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

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
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create category' });
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

const styles = {
  card: {
    maxWidth: 500,
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
};

export default AddCourseCategory;