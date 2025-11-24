function UserForm({ user, isOpen, onClose, onSave }) {
    const { useState, useEffect } = React;
    
    const [fields, setFields] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (user) {
            setFields({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        } else {
            setFields({
                name: '',
                email: '',
                phone: ''
            });
        }
        setValidationError('');
    }, [user, isOpen]);

    const updateField = (e) => {
        const { name, value } = e.target;
        setFields(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationError('');
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!fields.name.trim() || !fields.email.trim() || !fields.phone.trim()) {
            setValidationError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            await onSave(fields);
            onClose();
        } catch (err) {
            setValidationError(err.message || 'Có lỗi xảy ra khi lưu');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? 'Chỉnh sửa User' : 'Thêm User mới'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                {validationError && <div className="error-message">{validationError}</div>}
                <form onSubmit={submitForm}>
                    <div className="form-group">
                        <label htmlFor="name">Tên:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={fields.name}
                            onChange={updateField}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={fields.email}
                            onChange={updateField}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={fields.phone}
                            onChange={updateField}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {user ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

