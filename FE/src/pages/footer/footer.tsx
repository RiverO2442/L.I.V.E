export default function Footer() {
  return (
    <footer className="text-center text-white bg-[#0a4275] flex flex-col justify-center items-center">
      <div className="container p-4 pb-0">
        <section className="">
          <p className="d-flex justify-content-center align-items-center">
            <span className="me-3">Your Free Media Collection</span>
          </p>
        </section>
      </div>
      <div className="text-center p-3 bg-[rgba(0, 0, 0, 0.2)]">
        © 2025 Copyright:
        <a className="p-2 text-white" href="#">
          Meowilla
        </a>
      </div>
    </footer>
  );
}
