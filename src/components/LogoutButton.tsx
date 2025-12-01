import { logout } from '@/actions/auth-actions';

export default function LogoutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[var(--color-dark-light)] hover:text-red-300 rounded-md transition-colors w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Çıkış Yap</span>
            </button>
        </form>
    );
}
