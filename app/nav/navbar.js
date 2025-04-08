const Navbar = ({ item }) => {
    const navItems = [
        { name: "Home", link: "/" },
        { name: "Statistics", link: "/statistics" },
        { name: "Portal", link: "/portal" },
        { name: "Our Team", link: "/team" },
        { name: "Policy", link: "/policy" },
      ];

    return (
        <div className="bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-6">
                <div className="flex items-center space-x-4">
                    <img src="logo.png" alt="IIIT Logo" className="w-12" />
                    <p className="text-lg font-semibold">Training &amp; Placement Cell</p>
                </div>
                <div>
                    <ul className="flex space-x-6">
                        {navItems.map((items) => (
                            <li key={items.name}>
                                <a href={items.link} className={`hover:text-blue-300 font-semibold ${item === items.name && "text-blue-300 font-semibold"}`}>
                                    {items.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;