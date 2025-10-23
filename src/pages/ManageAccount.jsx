import React, { useEffect, useState } from 'react';
import './ManageAccount.css';
import { useNavigate }                from 'react-router-dom';
import { API_BASE_URL }               from '../config';

const defaultSubjects = {
  jee: ['Physics', 'Chemistry', 'Maths'],
  neet: ['Physics', 'Chemistry', 'Zoology', 'Botany'],
};

const getStandardsForCard = (cardId) => {
  switch (cardId) {
    case 'class1-5':
      return ['1', '2', '3', '4', '5'];
    case 'class6-12':
      return ['6', '7', '8', '9', '10', '11', '12'];
    case 'jee':
    case 'neet':
      return ['11', '12'];
    default:
      return [];
  }
};

const getCardsForMode = (mode) => {
  if (mode === 'academics') {
    return [
      { value: 'kindergarten', label: 'Kindergarten' },
      { value: 'class1-5', label: 'Class 1 - 5' },
      { value: 'class6-12', label: 'Class 6 - 12' },
    ];
  } else if (mode === 'professional') {
    return [
      { value: 'jee', label: 'JEE' },
      { value: 'neet', label: 'NEET' },
    ];
  }
  return [];
};

const ManageAccount = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'user',
    newSubject: '',
    access: {
      mode: '',
      cardId: '',
      subjects: [],
      standards: [],
    },
  });
  useEffect(() => {
    const start = performance.now();
    fetch(`${API_BASE_URL}/checkSession`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/checkSession`, {
      //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/checkSession`, {
      method: "GET",
      credentials: 'include'
    }).then(resp => resp.json())
      .then(text => {
        const end = performance.now(); // End time
        console.log(`Fetch for chack sessio in manage user took ${end - start} ms`);
        // console.log("checksession inside managae user",text)
        if (text.status === 'failed') {
          localStorage.removeItem('currentUser');
          navigate('/signin');
        } else {
          getUsers()
        }
      }).catch(() => { }
        // console.log("Session check failed:", err);
      );
  }, []);


  const getUsers = () => {
    const start = performance.now();
    fetch(`${API_BASE_URL}/getUsers`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/getUsers`, {
      //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/getUsers`, {
      method: "GET",
      credentials: 'include'
    })
      .then(resp => {
        //console.log('Getting users was successful');
        return resp.json();
      })
      .then(data => {
        const end = performance.now(); // End time
        console.log(`Fetch for getting user in manager user took ${end - start} ms`);
        //console.log(data)
        const newUsers = data.map(user => ({
          name: user.userName,
          phone: user.phoneNumber,
          email: user.gmail,
          password: user.password,
          role: user.role,
          access: {
            mode: user.coursetype || '',
            cardId: user.courseName || '',
            subjects: user.subjects || [],
            standards: user.standards || [],
          }
        }));

        setUsers(newUsers); // ✅ Replace the entire users list

      })
      .catch(() => {
        //console.log('Getting user from DB error', err);
      });
  }
  // const getUser=()=>{
  //   fetch(`http://localhost:80/getUsers`,{
  //     method:"GET",
  //     credentials:'include'
  //   }).then(resp=>{console.log('getting user from was successful')
  //     console.log(resp)
  //   })
  //   .catch(err=>{console.log('getting user from db error')})
  // }
  const handleCardChange = (e) => {
    const cardId = e.target.value;
    const defaultSubjs = defaultSubjects[cardId] || [];
    setFormData((prev) => ({
      ...prev,
      access: {
        ...prev.access,
        cardId,
        standards: [],
        subjects: defaultSubjs,
      },
    }));
  };



  const handleSubjectChange = (subject) => {
    const current = formData.access.subjects;
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];

    setFormData({
      ...formData,
      access: {
        ...formData.access,
        subjects: updated,
      },
    });
  };

  const handleSubmit = (e) => {
    //console.log(users)
    e.preventDefault();
    const userToSave = { ...formData };
    delete userToSave.newSubject;

    if (editIndex !== null) {
      const start = performance.now();
      fetch(`${API_BASE_URL}/updateUser/${users[editIndex].email}`, {
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/updateUser/${users[editIndex].email}`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/updateUser/${users[editIndex].email}`,{
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // 👈 important
        },
        body: JSON.stringify({
          databaseName: "users",
          collectionName: "users",
          user: {
            userName: formData.name,
            phoneNumber: formData.phone,
            gmail: formData.email,
            password: formData.password,
            role: formData.role,
            coursetype: formData.access.mode,
            courseName: formData.access.cardId,
            standards: formData.access.standards,
            subjects: formData.access.subjects
          }
        })
      }).then(resp => {
        return resp.text();
      })
        .then((data) => {
          getUsers()
          setEditIndex(null);

          if (data.status === 'pass') {

            const end = performance.now(); // End time
            console.log(`Fetch for update user in manageuser took ${end - start} ms`);
            //console.log(data)
            //  const updated = [...users];
            // updated[editIndex] = userToSave;
            // setUsers(updated);
            // fetchcodefor update
          }
        }).catch(() => {
          //console.log("error in update user",err)
        })


    } else {
      // console.log(users)
      const start = performance.now();
      fetch(`${API_BASE_URL}/newUser`, {
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/newUser`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/newUser`,{
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // 👈 important
        },
        body: JSON.stringify({
          databaseName: "users",
          collectionName: "users",
          user: {
            userName: formData.name,
            phoneNumber: formData.phone,
            gmail: formData.email,
            password: formData.password,
            role: formData.role,
            coursetype: formData.access.mode,
            courseName: formData.access.cardId,
            standards: formData.access.standards,
            subjects: formData.access.subjects
          }
        })
      }).then(resp => {
        return resp.json();
      })
        .then(data => {
          //console.log(data)

          const end = performance.now(); // End time
          console.log(`Fetch for adding user in manage user took ${end - start} ms`);
          //console.log(data)
          if (data.status === 'pass') {
            getUsers()
            //setUsers([...users, userToSave]);
            //console.log("data added successfully")
          }
          if (data.status === 'failed') {
            console.log("user already exist")
            //setUsers(prev=>prev.filter(u=>u.email!==userToSave.email))
          }
        }).catch(() => {
          //setUsers(prev=>prev.filter(u=>u.email!==userToSave.email))
        })
    }

    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      role: 'user',
      newSubject: '',
      access: {
        mode: '',
        cardId: '',
        subjects: [],
        standards: [],
      },
    });
  };

  const handleStandardChange = (standard) => {
    const current = formData.access.standards;
    const updated = current.includes(standard)
      ? current.filter((s) => s !== standard)
      : [...current, standard];

    setFormData({
      ...formData,
      access: {
        ...formData.access,
        standards: updated,
      },
    });
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to Delete this User")
    if (!confirmed) return
    const start = performance.now();
    fetch(`${API_BASE_URL}/deleteUser/${users[index].email}`, {
      //  fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/deleteUser/${users[index].email}`,{
      // fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/deleteUser/${users[index].email}`,{
      method: "DELETE",
      credentials: 'include'
    }).then(() => { }).then(() => {
      getUsers()
      const end = performance.now(); // End time
      console.log(`Fetch for delete in manage user took ${end - start} ms`);
      //    const updated = [...users];
      // updated.splice(index, 1);
      // setUsers(updated);
    })
      .catch(() => {
        // console.log(err)
      })

  };

  const handleEdit = (index) => {
    const container = document.querySelector('.manage-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    } console.log("inside edit")
    setEditIndex(index);
    //console.log(users[index].role)
    setFormData({ ...users[index], newSubject: '' });
  };

  const handleBack = () => {
    window.location.href = "http://localhost:5173/adminhome";
  };

  const subjectOptions = {
    academics: ['Math', 'English', 'Science'],
    professional: ['Aptitude', 'Reasoning'],
    jee: defaultSubjects.jee,
    neet: defaultSubjects.neet,
  };

  return (
    <div className="manage-container">
      <h2>Manage Users</h2>

      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="phone"
          placeholder="Phone Number"//UPDATED phone number field
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <label>Role:</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === 'user' && (
          <div className="restrictions">
            <label>Mode:</label>
            <select
              value={formData.access.mode}
              onChange={(e) => {
                const mode = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  access: {
                    ...prev.access,
                    mode,
                    cardId: '',
                    standard: '',
                    subjects: [],
                  },
                }));
              }}
            >
              <option value="">-- Select --</option>
              <option value="academics">Academics</option>
              <option value="professional">Professional</option>
            </select>

            <label>Card:</label>
            <select
              value={formData.access.cardId}
              onChange={handleCardChange}
              disabled={!formData.access.mode}
            >
              <option value="">-- Select --</option>
              {getCardsForMode(formData.access.mode).map((card) => (
                <option key={card.value} value={card.value}>
                  {card.label}
                </option>
              ))}
            </select>

            {formData.access.cardId !== 'kindergarten' &&
              getStandardsForCard(formData.access.cardId).length > 0 && (
                <>
                  <label>Standards:</label>
                  <div className="checkbox-group">
                    {getStandardsForCard(formData.access.cardId).map((std) => (
                      <label key={std}>
                        <input
                          type="checkbox"
                          checked={formData.access.standards.includes(std)}
                          onChange={() => handleStandardChange(std)}
                        />
                        {std}
                      </label>
                    ))}
                  </div>

                </>
              )}

            <label>Subjects:</label>
            <div className="subject-options">
              {(subjectOptions[formData.access.cardId] || []).length > 0 ? (
                (subjectOptions[formData.access.cardId] || []).map((subject) => (
                  <label key={subject}>
                    <input
                      type="checkbox"
                      checked={formData.access.subjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                    />
                    {subject}
                  </label>
                ))
              ) : (
                <>
                  <div className="custom-subject-input">
                    <input
                      type="text"
                      placeholder="Enter subject"
                      value={formData.newSubject}
                      onChange={(e) =>
                        setFormData({ ...formData, newSubject: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newSubj = formData.newSubject.trim();
                        if (
                          newSubj &&
                          !formData.access.subjects.includes(newSubj)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            newSubject: '',
                            access: {
                              ...prev.access,
                              subjects: [...prev.access.subjects, newSubj],
                            },
                          }));
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <ul className="subject-list">
                    {formData.access.subjects.map((subject) => (
                      <li key={subject}>
                        {subject}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              access: {
                                ...prev.access,
                                subjects: prev.access.subjects.filter((s) => s !== subject),
                              },
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        <button type="submit" >{editIndex !== null ? 'Update User' : 'Create User'}</button>
      </form>

      <div className="user-list">
        <h3>Existing Users</h3>
        <ul>
          {users.map((u, idx) => (
            <li key={idx}>
              <strong>{u.name}</strong> ({u.email})<br />
              📞 {u.phone}<br />
              ✉ {u.email}<br />
              🛡 {u.role}<br />

              {u.role === 'user' && (
                <div className="access-summary">
                  Access: {u.access.mode}, {u.access.cardId},{' '}
                  {u.access.subjects.join(', ')}, Std: {u.access.standards.join(',')}
                </div>
              )}
              <button onClick={() => handleEdit(idx)}>Edit</button>
              <button onClick={() => handleDelete(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleBack}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        ← Back
      </button>

    </div>
  );
};

export default ManageAccount;
