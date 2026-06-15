PROJECT_ID ?= tofu-driver
REGION ?= us-central1
SERVICE ?= tofu-driver

.PHONY: check prod

check:
	node --check frontend/nospill/app.js
	node --check test_frontend_nospill.js
	node test_frontend_nospill.js

prod: check
	gcloud run deploy "$(SERVICE)" \
		--source . \
		--project="$(PROJECT_ID)" \
		--region="$(REGION)" \
		--allow-unauthenticated \
		--port=80 \
		--min-instances=0 \
		--max-instances=2
