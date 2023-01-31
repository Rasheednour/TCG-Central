import '../App.css';
import SignUpForm from '../components/SignUpForm.js'
import TopRibbon from '../components/TopRibbon.js'


function SignUpPage() {
  return (
    <div className="SignUpPage">
        <TopRibbon/>
        <SignUpForm/>
        
    </div>
  );
}

export default SignUpPage;