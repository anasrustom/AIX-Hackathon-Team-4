import asyncio
from sqlalchemy import create_engine, text

def check_data():
    engine = create_engine('sqlite:///./clm_database.db')
    with engine.connect() as conn:
        # Check contracts
        result = conn.execute(text('SELECT COUNT(*) FROM contracts'))
        contract_count = result.scalar()
        print(f"📊 Total Contracts: {contract_count}")
        
        # Check contracts by status
        result = conn.execute(text("SELECT status, COUNT(*) FROM contracts GROUP BY status"))
        print("\n📋 Contracts by Status:")
        for row in result:
            print(f"  - {row[0]}: {row[1]}")
        
        # Check risks
        result = conn.execute(text('SELECT COUNT(*) FROM risks'))
        risk_count = result.scalar()
        print(f"\n⚠️  Total Risks: {risk_count}")
        
        # Check risks by severity
        result = conn.execute(text("SELECT severity, COUNT(*) FROM risks GROUP BY severity"))
        print("\n🔴 Risks by Severity:")
        for row in result:
            print(f"  - {row[0]}: {row[1]}")
        
        # Check key dates
        result = conn.execute(text('SELECT COUNT(*) FROM key_dates'))
        dates_count = result.scalar()
        print(f"\n📅 Total Key Dates: {dates_count}")
        
        # Check expiration dates
        result = conn.execute(text("SELECT date_type, COUNT(*) FROM key_dates GROUP BY date_type"))
        print("\n📆 Key Dates by Type:")
        for row in result:
            print(f"  - {row[0]}: {row[1]}")

if __name__ == "__main__":
    check_data()
