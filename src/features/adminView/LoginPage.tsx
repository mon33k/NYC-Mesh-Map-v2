import type { FormEvent } from 'react'

type LoginPageProps = {
    onSubmit?: (email: string, password: string) => void
}

const MeshLogo = () => {
    return (
        <svg
            className="h-12 w-12"
            viewBox="0 0 48 48"
            aria-hidden="true"
        >
            <circle cx="10" cy="24" r="5" fill="currentColor" />
            <circle cx="24" cy="10" r="5" fill="currentColor" />
            <circle cx="38" cy="24" r="5" fill="currentColor" />
            <circle cx="24" cy="38" r="5" fill="currentColor" />

            <path
                d="M14 24L20 12M28 12L34 24M34 24L28 36M20 36L14 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <circle cx="24" cy="24" r="6" fill="currentColor" />
        </svg>
    )
}

const LoginPage = ({
    onSubmit,
}: LoginPageProps) => {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const email = String(formData.get('email') ?? '')
        const password = String(formData.get('password') ?? '')

        onSubmit?.(email, password)
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <section className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl md:flex-row">
                <aside className="flex flex-col justify-between bg-sky-700 p-8 text-white md:w-80">
                    <div>
                        <div className="flex items-center gap-3">
                            <MeshLogo />

                            <div>
                                <p className="text-2xl font-bold">
                                    NYC Mesh
                                </p>

                                <p className="text-sm text-sky-100">
                                    Map Admin
                                </p>
                            </div>
                        </div>

                        <p className="mt-10 text-sm leading-6 text-sky-100">
                            Sign in to manage map data and view administrative markers.
                        </p>
                    </div>

                    <p className="mt-10 text-xs text-sky-100">
                        NYC Mesh internal administration portal
                    </p>
                </aside>

                <div className="flex-1 p-6 sm:p-8">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Admin sign in
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Use your NYC Mesh administrator account.
                    </p>

                    <form
                        className="mt-8 flex flex-col gap-5"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-1">
                            <label
                                className="text-sm font-semibold text-slate-600"
                                htmlFor="email"
                            >
                                Email address
                            </label>

                            <input
                                className="rounded border border-slate-300 px-4 py-2 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label
                                    className="text-sm font-semibold text-slate-600"
                                    htmlFor="password"
                                >
                                    Password
                                </label>

                                <button
                                    className="text-sm text-sky-700 hover:underline"
                                    type="button"
                                >
                                    Reset password
                                </button>
                            </div>

                            <input
                                className="rounded border border-slate-300 px-4 py-2 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                className="h-4 w-4 accent-sky-700"
                                name="remember"
                                type="checkbox"
                            />

                            Keep me signed in on this device
                        </label>

                        <button
                            className="rounded bg-sky-700 px-4 py-2 font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-200"
                            type="submit"
                        >
                            Sign in to map admin
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default LoginPage