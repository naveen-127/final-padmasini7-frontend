import React, { useState, useEffect }                from 'react';
import { FiBook }                                    from 'react-icons/fi';
import { useNavigate }                               from 'react-router-dom';
import './AdminHome.css';
import { API_BASE_URL }                              from '../config';

const academicCards = [
  { id: 'kindergarten', subtitle: 'Kindergarten', title: 'Bright Beginnings' },
  { id: 'class1-5', subtitle: 'Class 1 - 5', title: 'Practice Zone' },
  { id: 'class6-12', subtitle: 'Class 6 - 12', title: 'Board Exam Kit' },
];

const professionalCards = [
  { id: 'jee', subtitle: 'JEE Exam', title: 'JEE Prep Material' },
  { id: 'neet', subtitle: 'NEET Exam', title: 'NEET Prep Material' },
];


const AdminHome = () => {
const navigate = useNavigate();
  //  const [user, setUser] = useState({
  //   email: 'admin@example.com',
  //   role: 'admin',
  //   access: {
  //     mode: 'professional',
  //     cardId: 'jee',
  //     subject: 'Physics',
  //     standard: '11'
  //   }
  // });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [subjectsByCard, setSubjectsByCard] = useState({});
  const [current, setCurrent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [mode, setMode] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
const [selectedStandard, setSelectedStandard] = useState(currentUser?.role === 'admin' ? '' : currentUser?.standards);
const[userRole,setUserRole]=useState(null);
const[courseType,setCourseType]=useState(null);
const[courseName,setCourseName]=useState(null);
const[currSubjects,setCurrSubjects]=useState();
const[currStandards,setCurrStandards]=useState();
  useEffect(()=>{
    if(localStorage.getItem('currentUser')!==null){
       const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    //console.log("UpdateUser triggered, storedUser = ", storedUser);
    setCurrentUser(storedUser);
    setUserRole(storedUser.role)
    setCourseType(storedUser.courseType)
    setCourseName(storedUser.courseName)
      //return;
    }
     const start = performance.now(); 
    fetch(`${API_BASE_URL}/checkSession`,{
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/checkSession`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/checkSession`,{
      method:"GET",
      credentials:'include'
    }).then(resp=>resp.json())
    .then(data=>{
      const end = performance.now(); // End time
      console.log(`Fetch admin home check session took ${end - start} ms`);
      //console.log("check session inside admin home ",data)
     if (data.status === 'failed') {
    navigate('/signin')
   return;
  }
  if(data.status==='pass'){
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    //console.log("UpdateUser triggered, storedUser = ", storedUser);
    setCurrentUser(storedUser);
    setUserRole(storedUser.role)
    setCourseType(storedUser.courseType)
    setCourseName(storedUser.courseName)
  }
   const start1 = performance.now(); 
  fetch(`${API_BASE_URL}/UserSubjectStd`,{
    // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/UserSubjectStd`,{
    //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/UserSubjectStd`,{
     method:"GET",
      credentials:'include'
  }).then(resp=>resp.json())
  .then(data=>{
    const end1 = performance.now(); // End time
      console.log(`Fetch for admin home get sub and std took ${end1 - start1} ms`);
    // console.log(data);
    setCurrSubjects(data.subject)
    setCurrStandards(data.standards)
  }).catch(() => {}
    // console.log("Session check for sub and std failed:", err)
  );
  //  console.log("inside admin home for course type:",courseType)
  //   console.log("course name: ",courseName)
  //   console.log(userRole)
    }).catch(err => console.log("Session check failed:", err));
     //console.log(userRole)
  },[])
// useEffect(() => {
//     // Preload default subjects if card matches
//     if (currentUser.role !== 'admin' && currentUser.access.cardId) {
//       handleCardClick({
//         id: user.access.cardId,
//         title: user.access.cardId === 'jee' ? 'JEE Prep Material' : 'NEET Prep Material',
//         subtitle: user.access.cardId === 'jee' ? 'JEE Exam' : 'NEET Exam'
//       });
//     }
   
//   }, []);

  const currentCardId = selectedCard?.id || null;
  const currentSubjects = currentCardId ? subjectsByCard[currentCardId] || [] : [];

  const handleAdd = () => {
    if (!current.trim() || currentCardId === null) return;
    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = Array.isArray(copy[currentCardId]) ? [...copy[currentCardId]] : [];
      arr.push(current.trim());
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleUpdate = () => {
    if (currentCardId === null || selectedIndex === null || !current.trim()) return;
    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[currentCardId] || [])];
      arr[selectedIndex] = current.trim();
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleDelete = () => {
    if (currentCardId === null || selectedIndex === null) return;
    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[currentCardId] || [])];
      arr.splice(selectedIndex, 1);
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleSelectSubject = (idx, navigateToPage = false) => {
const isRestricted = (
  ['jee', 'neet', 'class1-5', 'class6-12'].includes(selectedCard?.id)
) && !selectedStandard;
    if (isRestricted) {
      alert('Please select a standard before proceeding.');
      return;
    }
    setSelectedIndex(idx);
    setCurrent(currentSubjects[idx] || '');
    if (navigateToPage) {
     // console.log("mide",mode)
      navigate('/adminright', {
  state: {
    cardId: currentCardId,
    subjectName:userRole==='admin'? currentSubjects[idx]:currSubjects[idx],
    standard: selectedStandard,  // Always pass standard
    examTitle: selectedCard.title,
    examSubtitle: selectedCard.subtitle,
    courseName: mode,
  },
});

    }
  };

  const handleCancelAll = () => {
    setSelectedIndex(null);
    setCurrent('');
    setMode(null);
    setSelectedCard(null);
    setSelectedStandard('');
  };

  const handleCancelSelection = () => {
    setSelectedIndex(null);
    setCurrent('');
  };

  const handleCardClick = (card) => {
    if (!subjectsByCard[card.id]) {
      let defaults = [];
      if (card.id === 'jee') {
        defaults = ['Physics', 'Chemistry', 'Maths'];
      } else if (card.id === 'neet') {
        defaults = ['Physics', 'Chemistry', 'Zoology', 'Botany'];
      }
      setSubjectsByCard((prev) => ({
        ...prev,
        [card.id]: defaults,
      }));
    }
    setSelectedIndex(null);
    setCurrent('');
    setSelectedStandard('');
    setSelectedCard(card);
  };

  return (
    <div className="container">
      {mode !== null && selectedCard !== null && (
  <>
    <button className="dis" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

    <aside className={`sidebar ${menuOpen ? '' : 'hidden'}`}>
      <h2 className="sub">Subjects</h2>
      <ul>
        {currentSubjects.length === 0 ? (
          <li className="empty">No subjects in this category</li>
        ) : userRole==='admin'?(
          currentSubjects.map((subj, idx) => {
            const restricted = (selectedCard?.id === 'jee' || selectedCard?.id === 'neet') && !selectedStandard;
            return (
              <li
                key={idx}
                className={`${selectedIndex === idx ? 'active' : ''} ${restricted ? 'disabled' : ''}`}
                onClick={() => handleSelectSubject(idx, true)}
              >
                <FiBook className="icon" />
                <span>{subj}</span>
              </li>
            );
          })
        ):(currSubjects.map((subj, idx) => {
            const restricted = (selectedCard?.id === 'jee' || selectedCard?.id === 'neet') && !selectedStandard;
            return (
              <li
                key={idx}
                className={`${selectedIndex === idx ? 'active' : ''} ${restricted ? 'disabled' : ''}`}
                onClick={() => handleSelectSubject(idx, true)}
              >
                <FiBook className="icon" />
                <span>{subj}</span>
              </li>
            );
          }))}
      </ul>
    </aside>
  </>
)}

      <section className="main">
        <div className="header">
          {mode === null ? (
            <div className="mode-switch-container">
              {(userRole==='admin'||courseType==='academics')&&<button className="mode-button uniform" onClick={() => setMode('academics')}>Academics</button>}
              {(userRole==='admin'||courseType==='professional')&&<button className="mode-button uniform" onClick={() => setMode('professional')}>Professional Training</button>}
              {userRole==='admin'&&(<button className="mode-button uniform" onClick={() => navigate('/manage-account')}>Manage Account</button>)}

            </div>
          ) : (
            <>
              {(selectedCard?.id === 'jee' || selectedCard?.id === 'neet') ? (
                <div className="form">
                  <div className="selected-info">
                    <strong>Selected:</strong>&nbsp;
                    <span className="italic-text">
                      {selectedCard.title} ({selectedCard.subtitle})
                    </span>
                  </div>

                  <div className="standard-select">
                    <label>Select Standard:</label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {userRole!=='admin'?(currStandards.map((cardObj,idx)=>(
                        <option key={idx}>{cardObj}</option>
                      ))):(<>
                         <option>11</option>
                        <option>12</option>
                      </>
                       
                      )}
                    </select>
                  </div>

                  <div className="card-cancel-wrapper">
                    <button className="card-cancel-button" onClick={() => setSelectedCard(null)}>Back</button>
                    <button className="card-cancel-button" onClick={handleCancelAll}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="subs">Subjects</h3>

                  <div className="summary-box">
                    {selectedCard === null ? (
                      <span>Select a card above to manage its subjects</span>
                    ) : currentSubjects.length === 0 ? (
                      <span>No subjects available in this card</span>
                    ) : (
                      <select
                        className="summary-dropdown"
                        value={selectedIndex ?? ''}
                        onChange={(e) => handleSelectSubject(Number(e.target.value))}
                        disabled={(selectedCard?.id === 'jee' || selectedCard?.id === 'neet') && !selectedStandard}
                      >
                        <option value="" disabled>Select a subject</option>
                        {currentSubjects.map((subj, idx) => (
                          <option key={idx} value={idx}>{subj}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedCard === null ? (
                    <div className="cards-wrapper">
                      <div className="cards-container">
                        {(mode === 'academics' ? academicCards : professionalCards).map((cardObj) => (
                          userRole==='admin'?(
                            <div key={cardObj.id} className="card" onClick={() => handleCardClick(cardObj)}>
                            <div className="card-subtitle">{cardObj.subtitle}</div>
                            <div className="card-title">{cardObj.title}</div>
                            <button className="card-button">Select</button>
                          </div>
                          ):(cardObj.id===courseName&&(<div key={cardObj.id} className="card" onClick={() => handleCardClick(cardObj)}>
                            <div className="card-subtitle">{cardObj.subtitle}</div>
                            <div className="card-title">{cardObj.title}</div>
                            <button className="card-button">Select</button>
                          </div>))
                        ))}
                      </div>
                      <div className="card-cancel-wrapper">
                        <button className="card-cancel-button" onClick={handleCancelAll}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="form">
                      <div className="selected-info">
                        <strong>Selected Card:</strong>&nbsp;
                        <span className="italic-text">
                          {selectedCard.title} ({selectedCard.subtitle})
                        </span>
                      </div>
                       {/* 👇 Show Standard Select if applicable */}
{['class1-5', 'class6-12'].includes(selectedCard?.id) && currentSubjects.length > 0 && (
    <div className="standard-select">
      <label>Select Standard:</label>
      <select
        value={selectedStandard}
        onChange={(e) => setSelectedStandard(e.target.value)}
      >
        <option value="">-- Select --</option>
        {selectedCard?.id === 'class1-5' && (
          <>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </>
        )}
        {selectedCard?.id === 'class6-12' && (
          <>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </>
        )}
      </select>
    </div>
  )}
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                      />

                      <div className="buttons">
                        <button onClick={handleAdd}>Add New</button>
                        <button onClick={handleUpdate} disabled={selectedIndex === null}>Update</button>
                        <button onClick={handleDelete} disabled={selectedIndex === null}>Delete</button>
                        <button onClick={handleCancelSelection}>Cancel</button>
                      </div>

                      <div className="card-cancel-wrapper">
                        <button className="card-cancel-button" onClick={() => setSelectedCard(null)}>Back</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminHome;