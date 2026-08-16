from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.goto("http://127.0.0.1:4173", wait_until="networkidle")
    page.locator("#label").fill("Navy Blazer")
    page.locator("#swatch-form").evaluate("form => { form.color.value = '#273247'; form.requestSubmit(); }")
    page.locator("#label").fill("Cream Tee")
    page.locator("#swatch-form").evaluate("form => { form.color.value = '#E7DDC9'; form.requestSubmit(); }")
    assert page.locator(".swatch").count() == 2
    page.get_by_role("button", name="Move down").first.click()
    assert page.locator(".swatch-name").first.text_content() == "Cream Tee"
    page.reload(wait_until="networkidle")
    assert page.locator(".swatch-name").first.text_content() == "Cream Tee"
    page.get_by_role("button", name="Remove").first.click()
    page.get_by_role("button", name="Remove swatch").click()
    assert page.locator(".swatch").count() == 1
    assert not errors, errors
    page.screenshot(path="tests/smoke.png", full_page=True)
    browser.close()
print("browser smoke test passed")
