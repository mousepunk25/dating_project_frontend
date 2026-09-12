import RegisterUser from "@/components/register-user";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md sm:max-w-lg space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Zarejestruj się
          </h2>
          <p className="text-sm text-gray-600">
            Utwórz konto, aby uzyskać dostęp do serwisu
          </p>
        </div>

        {/* Registration Form Component */}
        <div className="mt-8">
          <RegisterUser />
        </div>

      </div>
    </main>
  );
}