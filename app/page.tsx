import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export default async function Home() {
  const messages = await sql`
    SELECT * FROM messages
    ORDER BY id DESC
  `;

  async function addMessage(formData: FormData) {
    'use server';

    const message = String(
      formData.get('message') ?? ''
    ).trim();

    if (!message) return;

    const db = neon(process.env.DATABASE_URL!);

    await db`
      INSERT INTO messages (message)
      VALUES (${message})
    `;

    revalidatePath('/');
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold">
          Менің алғашқы веб-қосымшам
        </h1>

        <p className="mb-6 text-gray-600">
          Бұл қосымша Neon бұлттық деректер қорымен жұмыс істейді.
        </p>

        <form action={addMessage} className="mb-8">
          <input
            type="text"
            name="message"
            placeholder="Хабарлама енгізіңіз"
            required
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="mt-3 rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Сақтау
          </button>
        </form>

        <h2 className="mb-4 text-xl font-semibold">
          Хабарламалар тізімі
        </h2>

        <ul className="space-y-3">
          {messages.map((item) => (
            <li
              key={item.id}
              className="rounded-lg bg-gray-100 p-3"
            >
              {item.message}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}