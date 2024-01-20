import Head from 'next/head';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>PULSE</title>
        <meta name="description" content="Making short form content from lectures." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #ff4d6e; /* Vibrant pink background */
          color: #fff; /* White text */
        }
      `}</style>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
      `}</style>
      <header className="bg-[#ff4d6e] py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-4xl font-extrabold font-pacifico">PULSE</h1>
          <nav className="flex space-x-10 text-l">
            <a href="#" className="text-white hover:underline">Home</a>
            <a href="/aboutus" className="text-white hover:underline">About Us</a>
          </nav>
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ff4d6e] to-[#2e026d]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <p className="text-white text-2xl lg:text-3xl xl:text-4xl text-center">
            Making short form content from lectures.
          </p>
          <div className="flex gap-8">
            <div className="bg-white/20 p-8 rounded-xl">
              {/* Your audio upload component goes here */}
              <label htmlFor="audioInput" className="text-white block mb-2">
                Upload Audio
              </label>
              <input type="file" id="audioInput" className="mt-2" />
            </div>
            <div className="text-white font-bold text-2xl lg:text-3xl xl:text-4xl mt-8">OR</div>
            <div className="bg-white/20 p-8 rounded-xl">
              {/* Your PowerPoint upload component goes here */}
              <label htmlFor="pptInput" className="text-white block mb-2">
                Upload PowerPoint
              </label>
              <input type="file" id="pptInput" className="mt-2" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
