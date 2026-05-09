import React from 'react'

const Settings = () => {

   const sections = [
    {
      title: "Account",
      items: ["Profile Information", "Email Address", "Password", "Two-Factor Authentication"],
    },
    {
      title: "Preferences",
      items: ["Dark Mode", "Notifications", "Language", "Privacy Settings"],
    },
    {
      title: "Billing",
      items: ["Payment Methods", "Subscriptions", "Invoices"],
    },
  ];


  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[260px_1fr] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Sidebar */}
        <aside className="border-r border-zinc-800 p-6 bg-zinc-900/80 backdrop-blur-xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Manage your account and preferences
            </p>
          </div>

          <nav className="space-y-3">
            {[
              "General",
              "Profile",
              "Security",
              "Notifications",
              "Appearance",
              "Billing",
            ].map((item, index) => (
              <button
                key={item}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 ${
                  index === 0
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="p-8 space-y-8 bg-zinc-950">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">General Settings</h2>
              <p className="text-zinc-400 mt-1 text-sm">
                Update your preferences and account details.
              </p>
            </div>

            <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200">
              Save Changes
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-500 flex items-center justify-center text-3xl font-bold">
              B
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="bhumi"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="bhumi@example.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <h3 className="text-xl font-semibold mb-6">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between bg-zinc-800 rounded-2xl px-4 py-4 hover:bg-zinc-700 transition-colors duration-200"
                    >
                      <span>{item}</span>

                      <button className="bg-zinc-700 hover:bg-white hover:text-black transition-all duration-200 px-4 py-2 rounded-xl text-sm font-medium">
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-xl font-semibold">Quick Preferences</h3>

            {[
              "Enable Dark Mode",
              "Email Notifications",
              "Push Notifications",
              "Auto Save",
            ].map((toggle) => (
              <div
                key={toggle}
                className="flex items-center justify-between bg-zinc-800 px-5 py-4 rounded-2xl"
              >
                <span>{toggle}</span>

                <div className="w-14 h-8 bg-white rounded-full flex items-center p-1 justify-end cursor-pointer">
                  <div className="w-6 h-6 bg-black rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );

}

export default Settings


 
 
