
import { useState } from 'react'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <header className="relative z-40 w-full bg-white shadow">
            <div className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-4">
                <a href="https://www.nycmesh.net/" className="flex min-w-0 items-center gap-2" >
                    <img src="/mesh.svg" alt="NYC Mesh" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
                    <span className="truncate text-base font-semibold text-black sm:text-xl">
                        NYC Mesh
                    </span>
                </a>

                <nav className="hidden items-center space-x-4 text-sm font-medium lg:flex">
                    <a href="#" className="text-black hover:text-blue-600">
                        Map
                    </a>

                    <a href="#" className="text-black hover:text-blue-600">
                        FAQ
                    </a>

                    <a href="#" className="text-black hover:text-blue-600">
                        Docs/Wiki
                    </a>

                    <a href="#" className="text-black hover:text-blue-600">
                        Blog
                    </a>

                    <a href="#" className="text-black hover:text-blue-600">
                        Merch
                    </a>

                    <a href="#" className="text-green-600 hover:text-green-700">
                        Get Support
                    </a>

                    <a href="#" className="font-semibold text-black hover:text-blue-600">
                        Donate
                    </a>

                    <a href="#" className="text-blue-600 hover:text-blue-800">
                        Get Connected
                    </a>
                </nav>

                <button
                    type="button"
                    className="rounded-md p-2 text-2xl leading-none text-black hover:bg-gray-100 lg:hidden"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={ menuOpen  ? 'Close navigation menu' : 'Open navigation menu' }
                    aria-expanded={menuOpen} >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {menuOpen && (
                <nav className="border-t border-gray-200 bg-white px-3 py-2 lg:hidden">
                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-black hover:bg-gray-100" onClick={closeMenu} >
                        Map
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-black hover:bg-gray-100" onClick={closeMenu} >
                        FAQ
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-black hover:bg-gray-100" onClick={closeMenu} >
                        Docs/Wiki
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-black hover:bg-gray-100" onClick={closeMenu} >
                        Blog
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-black hover:bg-gray-100" onClick={closeMenu} >
                        Merch
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-green-600 hover:bg-gray-100" onClick={closeMenu} >
                        Get Support
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100" onClick={closeMenu} >
                        Donate
                    </a>

                    <a href="#" className="block rounded px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100" onClick={closeMenu} >
                        Get Connected
                    </a>
                </nav>
            )}
        </header>
    )
};

export default Header;


