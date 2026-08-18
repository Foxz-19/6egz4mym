from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:4213", wait_until="networkidle")
    page.emulate_media(reduced_motion="reduce")
    assert page.locator(".clock").evaluate("node => getComputedStyle(node).transitionDuration") != "0.3s"
    page.emulate_media(reduced_motion="no-preference")
    assert page.locator("#minutes").inner_text() == "08"
    page.locator("#thought").fill("   ")
    page.get_by_role("button", name="Save thought").click()
    assert "Write a thought" in page.locator("#captureStatus").inner_text()
    page.get_by_role("button", name="Start the water").click()
    page.get_by_role("button", name="5 min").click()
    assert page.locator("#durationDialog").is_visible()
    page.get_by_role("button", name="Change duration").click()
    page.locator("#durationDialog").wait_for(state="hidden")
    page.wait_for_timeout(100)
    assert page.locator("#minutes").inner_text() == "05"
    page.get_by_role("button", name="Start the water").click()
    page.wait_for_timeout(1100)
    assert page.locator("#seconds").inner_text() == "59"
    page.locator("#thought").fill("Hot water is temporary weather.")
    page.get_by_role("button", name="Save thought").click()
    assert page.get_by_text("Hot water is temporary weather.").is_visible()
    assert "Captured at the very start" in page.locator("#thoughtList").inner_text()
    page.reload(wait_until="networkidle")
    assert page.get_by_text("Hot water is temporary weather.").is_visible()
    page.get_by_role("button", name="Delete thought: Hot water is temporary weather.").click()
    page.keyboard.press("Escape")
    assert page.get_by_text("Hot water is temporary weather.").is_visible()
    page.get_by_role("button", name="Delete thought: Hot water is temporary weather.").click()
    page.get_by_role("button", name="Delete thought", exact=True).click()
    page.locator("#deleteDialog").wait_for(state="hidden")
    page.locator("#emptyState").wait_for(state="visible")
    assert page.locator("#emptyState").is_visible()
    page.set_viewport_size({"width": 375, "height": 812})
    page.locator(".skip-link").focus()
    assert page.locator(".skip-link").is_visible()
    assert page.locator("#thought").is_visible()
    assert not errors, errors
    page.screenshot(path="ui-check.png", full_page=True)
    browser.close()
