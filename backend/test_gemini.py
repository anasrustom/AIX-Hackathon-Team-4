import os, sys, json
import google.generativeai as genai

key = os.environ.get("GEMINI_API_KEY")
print("SDK version:", getattr(genai, "__version__", "unknown"))
print("Has key?", bool(key), "len:", len(key or ""))
if not key:
    sys.exit(1)

genai.configure(api_key=key)

def try_model(name):
    try:
        print(f"\nTrying model: {name}")
        m = genai.GenerativeModel(name)
        r = m.generate_content("Say OK.")
        print("Reply:", repr(getattr(r, "text", "")))
        return True
    except Exception as e:
        print("ERROR:", type(e).__name__, "->", e)
        return False

# Try a few common names
for model in [
    "gemini-1.5-flash-latest",
    "models/gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "models/gemini-1.5-pro-latest",
    "gemini-pro",
    "models/gemini-pro",
    "gemini-1.0-pro",
    "models/gemini-1.0-pro",
]:
    if try_model(model):
        break
