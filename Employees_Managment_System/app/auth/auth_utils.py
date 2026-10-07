from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()


def password_to_hash(raw_password: str) -> str:
    return password_hasher.hash(raw_password)


def verify_password(raw_password: str, hashed_password: str) -> bool:
    return password_hasher.verify(raw_password, hashed_password)


if __name__ == "__main__":
    user_pwd: str = "kumar123"
    hashed_user_pwd: str = password_to_hash(user_pwd)

    print("Hashed:", hashed_user_pwd)
    print("Match valid:", verify_password(user_pwd, hashed_user_pwd))
    print("Match invalid:", verify_password("wrongpass", hashed_user_pwd))
