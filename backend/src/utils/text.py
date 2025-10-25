import re

_AR_DIGITS = "٠١٢٣٤٥٦٧٨٩"
_EN_DIGITS = "0123456789"
_AR_TO_EN = str.maketrans({ord(_AR_DIGITS[i]): _EN_DIGITS[i] for i in range(10)})

def normalize_ar_digits(s: str) -> str:
    """Convert Arabic-Indic digits to ASCII digits."""
    if not isinstance(s, str):
        return s
    return s.translate(_AR_TO_EN)

def strip_tatweel(s: str) -> str:
    """Remove Arabic tatweel (kashida) character to stabilize OCR/LLM parsing."""
    if not isinstance(s, str):
        return s
    return s.replace("ـ", "")

def clean_spaces(s: str) -> str:
    """Collapse whitespace and tidy punctuation spacing for RAG/LLM input."""
    if not isinstance(s, str):
        return s
    s = s.replace("\r", "\n")
    # squash multiple spaces/newlines
    s = re.sub(r"[ \t\f\v]+", " ", s)
    s = re.sub(r"\n{2,}", "\n\n", s)
    s = s.strip()
    return s

def squeeze_newlines(s: str, max_consecutive: int = 2) -> str:
    """Limit consecutive newlines to improve chunking."""
    if not isinstance(s, str):
        return s
    pat = r"\n{" + str(max_consecutive + 1) + r",}"
    return re.sub(pat, "\n" * max_consecutive, s)

def normalize_whitespace(s: str) -> str:
    """One-liner normalization: digits + tatweel + spaces + limited newlines."""
    s = normalize_ar_digits(s)
    s = strip_tatweel(s)
    s = clean_spaces(s)
    s = squeeze_newlines(s, 2)
    return s

def safe_truncate(s: str, n: int) -> str:
    """Truncate without splitting surrogate pairs; add ellipsis if needed."""
    if not isinstance(s, str):
        return s
    return s if len(s) <= n else (s[: max(0, n - 1)] + "…")
