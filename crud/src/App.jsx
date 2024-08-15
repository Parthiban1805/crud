import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({
        topic_title: '',
        topic_description: ''
    });
    const [editUserId, setEditUserId] = useState(null);

    const getAllUsers = async () => {
        try {
            const res = await axios.get("https://crud-0fr4.onrender.com/users");
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching users');
            setLoading(false);
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleAddRecord = async () => {
        try {
            const res = await axios.post("https://crud-0fr4.onrender.com/users", newUser);
            setUsers([...users, res.data]);
            setNewUser({ topic_title: '', topic_description: '' });
        } catch (error) {
            setError('Error adding user');
            console.error("Error adding user:", error);
        }
    };

    const handleEditRecord = async (userId) => {
        try {
            const updatedUser = {
                topic_title: newUser.topic_title,
                topic_description: newUser.topic_description
            };
            await axios.put(`https://crud-0fr4.onrender.com/users/${userId}`, updatedUser);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, ...updatedUser } : user
            ));
            setNewUser({ topic_title: '', topic_description: '' }); 
            setEditUserId(null);
        } catch (error) {
            setError('Error updating user');
            console.error("Error updating user:", error);
        }
    };

    // Delete a user
    const handleDeleteRecord = async (userId) => {
        try {
            await axios.delete(`https://crud-0fr4.onrender.com/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            setError('Error deleting user');
            console.error("Error deleting user:", error);
        }
    };

    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    const filteredUsers = users.filter(user =>
        user.topic_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.topic_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='container'>
            <h3>CRUD Application</h3>
            {error && <p className='error'>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className='form-container'>
                        <input
                            type='search'
                            placeholder='Search'
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <div className='form-group'>
                            <input
                                type='text'
                                name='topic_title'
                                placeholder='Topic Title'
                                value={newUser.topic_title}
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                name='topic_description'
                                placeholder='Topic Description'
                                value={newUser.topic_description}
                                onChange={handleInputChange}
                            />
                            {editUserId ? (
                                <button onClick={() => handleEditRecord(editUserId)}>Update Record</button>
                            ) : (
                                <button onClick={handleAddRecord}>Add Record</button>
                            )}
                        </div>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Topic Title</th>
                                <th>Title Description</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.topic_title}</td>
                                        <td>{user.topic_description}</td>
                                        <td><button onClick={() => { setNewUser({ topic_title: user.topic_title, topic_description: user.topic_description }); setEditUserId(user._id); }}>Edit</button></td>
                                        <td><button onClick={() => handleDeleteRecord(user._id)}>Delete</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default App;
