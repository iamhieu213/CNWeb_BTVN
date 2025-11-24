const { useState, useEffect } = React;

function App() {
    const [userList, setUserList] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setErrorMsg('');
            const res = await fetch(API_URL);
            
            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }
            
            const result = await res.json();
            setUserList(result);
            setDisplayedUsers(result);
        } catch (err) {
            setErrorMsg(`Không thể tải danh sách: ${err.message}`);
            console.error('Lỗi khi tải users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setDisplayedUsers(userList);
        } else {
            const lowerQuery = query.toLowerCase();
            const matched = userList.filter(item =>
                item.name.toLowerCase().includes(lowerQuery)
            );
            setDisplayedUsers(matched);
        }
        setPage(1);
    }, [query, userList]);

    const pageCount = Math.ceil(displayedUsers.length / ITEMS_PER_PAGE);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const pageUsers = displayedUsers.slice(offset, offset + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount && pageCount > 0) {
            setPage(1);
        }
    }, [pageCount]);

    const addUser = async (data) => {
        try {
            setErrorMsg('');
            setSuccessMsg('');
            
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    username: data.name.toLowerCase().replace(/\s+/g, ''),
                    website: 'example.com'
                })
            });

            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }

            const created = await res.json();
            
            const maxId = userList.length > 0 ? Math.max(...userList.map(u => u.id)) : 0;
            const newUser = {
                ...created,
                id: maxId + 1
            };
            
            const newList = [...userList, newUser];
            setUserList(newList);
            setSuccessMsg('Đã thêm người dùng thành công!');
            
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(`Không thể thêm: ${err.message}`);
            throw err;
        }
    };

    const updateUser = async (data) => {
        try {
            setErrorMsg('');
            setSuccessMsg('');
            
            const res = await fetch(`${API_URL}/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...selectedUser,
                    name: data.name,
                    email: data.email,
                    phone: data.phone
                })
            });

            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }

            const updated = await res.json();
            
            const newList = userList.map(item =>
                item.id === selectedUser.id
                    ? { ...updated, phone: data.phone }
                    : item
            );
            setUserList(newList);
            setSuccessMsg('Đã cập nhật thông tin thành công!');
            
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(`Không thể cập nhật: ${err.message}`);
            throw err;
        }
    };

    const removeUser = async (id) => {
        if (!window.confirm('Xác nhận xóa người dùng này?')) {
            return;
        }

        try {
            setErrorMsg('');
            setSuccessMsg('');
            
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error(`Lỗi kết nối: ${res.status}`);
            }

            const newList = userList.filter(item => item.id !== id);
            setUserList(newList);
            setSuccessMsg('Đã xóa người dùng thành công!');
            
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg(`Không thể xóa: ${err.message}`);
        }
    };

    const saveForm = async (data) => {
        if (selectedUser) {
            await updateUser(data);
        } else {
            await addUser(data);
        }
    };

    const editUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const openAddForm = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    return (
        <div className="app">
            <div className="header">
                <h1>Quản lý Users</h1>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm theo tên..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={openAddForm}>
                        + Thêm User
                    </button>
                </div>
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            {isLoading ? (
                <div className="loading">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <UserTable
                        users={pageUsers}
                        onEdit={editUser}
                        onDelete={removeUser}
                    />
                    {pageCount > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={pageCount}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            <UserForm
                user={selectedUser}
                isOpen={showModal}
                onClose={closeModal}
                onSave={saveForm}
            />
        </div>
    );
}

const rootElement = ReactDOM.createRoot(document.getElementById('root'));
rootElement.render(<App />);
