import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UserProfilePage from "./pages/UserProfilePage";
import ContactProfilePage from "./pages/ContactProfilePage";
import AllContactsPage from "./pages/AllContactsPage";
import AddNewContact from "./pages/AddNewContact";
import EditContactPage from "./pages/EditContactPage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";


function App() {

  return (
    <div className="App">      
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<UserProfilePage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="add-contact" element={<AddNewContact />} />
          <Route path="contacts" element={<AllContactsPage />} />
          <Route path="contact/:_id" element={<ContactProfilePage />} />
          <Route path="contact/:_id/edit" element={<EditContactPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;


/*
      <form onSubmit={e => handleSubmit(e)}>
              <input onChange={e => handleChange(e)} name="email" type="text" placeholder='email' />
        <input onChange={e => handleChange(e)} name='password' type="text" placeholder='password' />
        <button>Yolla</button>
      </form> 
      <button onClick={testRedux}>redux</button>
*/