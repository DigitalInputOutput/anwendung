from django.core.management.base import BaseCommand
from pathlib import Path
from system.settings import DEBUG, HOME_DIR

class Command(BaseCommand): 
    help = 'Create Super User'

    def handle(self, *args, **options):
        ENV = "prod" if not DEBUG else "dev"
        template_path = Path(HOME_DIR / "client/html/desktop/index.template.html")
        output_path = Path(HOME_DIR / "client/html/desktop/index.html")

        critical_css = ""
        full_css = ""
        scripts = ""

        if ENV == "prod":
            critical_css = '<link rel="stylesheet" href="/cache/users/static/css/desktop/{{css_version}}/main_min_critical.css">'
            full_css = '<link rel="stylesheet" href="/cache/users/static/css/desktop/{{css_version}}/main_min.css">'
            scripts = '<script type="module" src="/cache/users/static/js/desktop/{{js_version}}/main_min.js"></script><script type="module">import { Dom, Main } from "/cache/users/static/js/desktop/{{js_version}}/main_min.js"; window.Dom = Dom;window.Main = new Main();</script>'
        else:
            critical_css = '' 
            full_css = "\n".join([
                '<link rel="stylesheet" href="/static/css/desktop/main.css">',
                '<link rel="stylesheet" href="/static/css/desktop/user/form.css">',
                '<link rel="stylesheet" href="/static/css/desktop/user/login.css">',
                '<link rel="stylesheet" href="/static/css/desktop/user/logup.css">',
                '<link rel="stylesheet" href="/static/css/desktop/anwendung/umfrage.css">',
                '<link rel="stylesheet" href="/static/css/desktop/checkbox.css">',
                '<link rel="stylesheet" href="/static/css/desktop/splitbar.css">'
            ])
            scripts = "\n".join([
                '<script type="module" src="/static/js/desktop/vanilla/ui/dom.js" defer></script>',
                '<script type="module" src="/static/js/desktop/main.js" defer></script>',
                '<script type="module" src="/static/js/desktop/splitbar.js"></script>',
                '''<script type="module">
                    import { Dom } from "/static/js/desktop/vanilla/ui/dom.js";
                    import { Main } from "/static/js/desktop/main.js";

                    window.Main = new Main();
                    window.Dom = Dom;
                </script>''',
            ])

        # Read template
        template = template_path.read_text()

        # Replace tags
        rendered = (
            template.replace("<!-- {{critical_css}} -->", critical_css)
                    .replace("<!-- {{full_css}} -->", full_css)
                    .replace("<!-- {{scripts}} -->", scripts)
        )

        # Write result
        output_path.write_text(rendered)

        print(f"[✓] index.html generated for {ENV}")