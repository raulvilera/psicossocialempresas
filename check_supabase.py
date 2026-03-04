
import httpx
import asyncio

SUPABASE_URL = "https://vzszzdeqbrjrepbzeiqq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3p6ZGVxYnJqcmVwYnplaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTksImV4cCI6MjA4NzAxOTIxOX0.Tu5mtdmSE1mQJEcEr8TNbUndlAl1SOUfrIcNlG6-4k8"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

async def check_table(table):
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/{table}?select=count",
                headers=HEADERS
            )
            if r.status_code == 200:
                print(f"Tabela '{table}' existe.")
                print(r.json())
            else:
                print(f"Tabela '{table}' não encontrada ou erro: {r.status_code}")
                print(r.text)
        except Exception as e:
            print(f"Erro ao acessar a tabela '{table}': {e}")

async def main():
    await check_table("users")
    await check_table("empresas")

if __name__ == "__main__":
    asyncio.run(main())
