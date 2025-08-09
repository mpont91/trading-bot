ENV_FILE = .env

SSH_SERVER = $(shell sed -n 's/^SSH_SERVER=//p' $(ENV_FILE))

RESTORE_DB_SERVER = $(shell sed -n 's/^RESTORE_DB_SERVER=//p' $(ENV_FILE))

SSH_CMD = ssh -q $(SSH_SERVER)

RESTORE_DB_CMD = scp $(RESTORE_DB_SERVER)

LOAD_NVM_CMD = source ~/.bashrc && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"

ssh:
	$(SSH_CMD)

deploy:
	$(SSH_CMD) '$(LOAD_NVM_CMD) && cd trading-bot && make production'

check:
	npm run build && \
	npm run format:check && \
	npm run lint && \
	npm run test


production:
	git pull && \
	npm --silent ci --no-progress && \
	npm run build && \
	npm run format:check && \
	npm run lint && \
	npm run test && \
	npm run migrate && \
	npm run server:restart && \
	npm run server:status

restore-db:
	$(RESTORE_DB_CMD)

update-packages:
	npx npm-check-updates -u
