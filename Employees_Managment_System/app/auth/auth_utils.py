from pwdlib import PasswordHash

password_hash_fun = PasswordHash.recommended()


def raw_pwd_to_hash(raw_password: str) -> str:
    converted_pwd = password_hash_fun.hash(raw_password)

    return converted_pwd


password_to_hash = raw_pwd_to_hash

# METHOD TO VERIFY THE PASSWORD HASH WITH THE RAW PASSWORD


def verify_password(raw_pwd: str, hashed_pwd: str) -> bool | str:
    verified_pwd = password_hash_fun.verify(raw_pwd, hashed_pwd)

    if verified_pwd == False:
        return f"{raw_pwd} is not converted into hashed password"

    return verified_pwd
