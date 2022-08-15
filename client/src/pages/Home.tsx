import RegisterForm from '../components/RegisterForm';

const Home = () => {

  return (
    <div className='flex flex-col w-full h-screen items-center justify-around'>
      <h1 className='text-4xl text-blue-500'>Welcome Our Contact App</h1>
      <div className='w-full flex justify-center items-center'>
        <RegisterForm/>
      </div>
    </div>
  )
}

export default Home