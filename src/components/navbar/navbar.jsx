import './navbar.css'


function Navbar() {
    return (
    <>
        <header className='header'>
            <div className='logo-group'>
                <a href='#'>
                <img className='logo' src="./src/assets/logo.svg" alt="logo" />
                <span>itor Vargas</span>
                </a>
            </div>

            <div className='bottom-links'>
                <div><a href='#' target='_blank'>Sobre</a></div>
                <div><a href='#' target='_blank'>Projetos</a></div>
                <div><a href='#' target='_blank'>Contatos</a></div>
            </div>
        </header>
        </>
    )

}
export default Navbar;