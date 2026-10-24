from pathlib import Path
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer

# Official Google Business Profile direct review solicitation link
REVIEW_URL = "https://g.page/r/CTmQQm_qiZmoEAE/review"
OUTPUT_FILE = Path("n_hotels_styled_qr.png")

qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_H,
    box_size=25,
    border=4,
)
qr.add_data(REVIEW_URL)
qr.make(fit=True)

# Generates sleek rounded dots with deep navy/charcoal styling
img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    fill_color=(20, 24, 33),  # Deep premium dark tone
    back_color=(255, 255, 255),
)

img.save(OUTPUT_FILE)
print(f"Styled hotel QR code created at: {OUTPUT_FILE.resolve()}")
