import RegisterUser from "@/components/register-user";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-1 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register your account
        </h2>
      </div>
        <RegisterUser />
    </div>
  )
}