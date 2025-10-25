"""
Test script to verify authentication and token generation
Run this to debug the 401 Unauthorized error
"""
import asyncio
import sys
from sqlalchemy import select
from src.config.database import get_db, init_db
from src.models.user import User
from src.api.routes.auth import create_access_token, get_password_hash
from datetime import timedelta
from src.config.settings import get_settings

settings = get_settings()

async def test_auth():
    print("🔍 Testing Authentication System...")
    print("=" * 60)
    
    # Initialize database
    await init_db()
    
    # Get a database session
    async for db in get_db():
        # Check if any users exist
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        if not users:
            print("❌ No users found in database!")
            print("ℹ️  Please create a user by signing up first.")
            return
        
        print(f"✅ Found {len(users)} user(s) in database:")
        for user in users:
            print(f"   - {user.email} (ID: {user.id}, Role: {user.role.value})")
        
        # Test token generation for the first user
        test_user = users[0]
        print(f"\n🔑 Generating test token for: {test_user.email}")
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        test_token = create_access_token(
            data={"sub": test_user.id}, 
            expires_delta=access_token_expires
        )
        
        print(f"✅ Token generated successfully!")
        print(f"\n📋 Token (first 50 chars): {test_token[:50]}...")
        print(f"📋 User ID in token: {test_user.id}")
        print(f"⏱️  Token expires in: {settings.access_token_expire_minutes} minutes")
        
        print("\n" + "=" * 60)
        print("🧪 Test the token with this curl command:")
        print("=" * 60)
        print(f"""
curl -X POST http://localhost:8000/api/contracts/upload \\
  -H "Authorization: Bearer {test_token}" \\
  -F "file=@path/to/your/file.pdf"
""")
        
        print("\n" + "=" * 60)
        print("💡 Troubleshooting Tips:")
        print("=" * 60)
        print("1. Make sure you're logged in through the frontend")
        print("2. Check browser console for the access_token in localStorage")
        print("3. If token is missing, log out and log in again")
        print("4. Token expires after 30 minutes - you may need to re-login")
        print("5. Check that NEXT_PUBLIC_API_URL=http://localhost:8000 in frontend/.env.local")
        
        break

if __name__ == "__main__":
    asyncio.run(test_auth())
