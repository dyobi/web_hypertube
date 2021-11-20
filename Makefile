NAME = HyperTube

GREEN_BOLD = \033[1;34m
WHITE_BOLD = \033[1;37m
YELLOW = \033[0;32m
UNDERLINE = \033[1;4;37m
RESET = \033[0;37m

all:
	@echo ""
	@echo "$(GREEN_BOLD)"	
	@echo " _  _ ____ __    ___ __  _  _ ____    ____ __   "
	@echo "/ )( (  __(  )  / __/  \( \/ (  __)  (_  _/  \  "
	@echo "\ /\ /) _)/ (_/( (_(  O / \/ \) _)     )((  O ) "
	@echo "(_/\_(____\____/\___\__/\_)(_(____)   (__)\__/  "
	@echo "\t _  _ _  _ ____ ____ ____ ____ _  _ ____ ____   "
	@echo "\t/ )( ( \/ (  _ (  __(  _ (_  _/ )( (  _ (  __)  "
	@echo "\t) __ ()  / ) __/) _) )   / )( ) \/ () _ () _)   "
	@echo "\t\_)(_(__/ (__) (____(__\_)(__)\____(____(____)  "
	@echo "$(RESET)"
	@echo ""
	@echo "$(YELLOW)requires:$(RESET)"
	@echo ""
	@echo "\tNODE"
	@echo "\tJAVA"
	@echo ""
	@echo "$(YELLOW)usage:$(RESET)"
	@echo ""
	@echo "\tmake check : to check environment variables of $(NAME) application"
	@echo "\tmake start : to initialize $(NAME) application"
	@echo "\tmake end : to terminate $(NAME) application"
	@echo ""
	@echo "$(YELLOW)util:$(RESET)"
	@echo ""
	@echo "\tmake ip : to find out ip address for url / env"
	@echo "\tmake apijs : to set api.js environment"
	@echo "\tmake urljs : to set url.js environment"
	@echo "\tmake ffmpeg : to install ffmpeg resources"
	@echo ""

start:
	@rm -rf logs
	@mkdir logs
	@cd logs && mkdir client && mkdir proxy && mkdir torrent && mkdir stream && mkdir api && mkdir socket

	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)Welcome! The server setting process is initializing.$(RESET)"
	@echo ""

#	@echo "     [   ]  Initializing the $(UNDERLINE)Proxy API Server$(RESET).\c"
#	@cd proxy && npm install --quiet --no-progress > /dev/null 2>&1
#	@cd proxy && nohup npm start > ../logs/proxy/log.out 2> ../logs/proxy/log.err &
#	@sleep 0.5
#	@echo "\r     [ $(YELLOW)#$(RESET) ]"
#	@echo ""
#	@sleep 0.5

	@echo "     [   ]  Initializing the $(UNDERLINE)Torrent API Server$(RESET).\c"
	@cd torrent && npm install --quiet --no-progress > /dev/null 2>&1
	@cd torrent && nohup npm start > ../logs/torrent/log.out 2> ../logs/torrent/log.err &
	@cd torrent && rm -rf public && mkdir public && cd public && mkdir sub
	@sleep 0.5
	@echo "\r     [ $(YELLOW)#$(RESET) ]"
	@echo ""
	@sleep 0.5

	@echo "     [   ]  Initializing the $(UNDERLINE)Stream API Server$(RESET).\c"
	@cd stream && npm install --quiet --no-progress > /dev/null 2>&1
	@cd stream && nohup npm start > ../logs/stream/log.out 2> ../logs/stream/log.err &
	@cd stream && rm -rf public && mkdir public && cd public && mkdir video
	@sleep 0.5
	@echo "\r     [ $(YELLOW)#$(RESET) ]"
	@echo ""
	@sleep 0.5

	@echo "     [   ]  Initializing the $(UNDERLINE)Socket API Server$(RESET).\c"
	@cd socket && npm install --quiet --no-progress > /dev/null 2>&1
	@cd socket && nohup npm start > ../logs/socket/log.out 2> ../logs/socket/log.err &
	@sleep 0.5
	@echo "\r     [ $(YELLOW)#$(RESET) ]"
	@echo ""
	@sleep 0.5

	@echo "     [   ]  Initializing the $(UNDERLINE)Database API Server$(RESET).\c"
	@cd api && rm -rf pictures
	@cd api && mkdir pictures
	@cd api && nohup java -jar api.jar > ../logs/api/log.out 2> ../logs/api/log.err &
	@sleep 0.5
	@echo "\r     [ $(YELLOW)#$(RESET) ]"
	@echo ""
	@sleep 0.5

	@echo "     [   ]  Initializing the $(UNDERLINE)React Frontend Server$(RESET).\c"
	@cd client && npm install --quiet --no-progress > /dev/null 2>&1
	@cd client && npm run build > /dev/null 2>&1
	@cd client && nohup node server.js > ../logs/client/log.out 2> ../logs/client/log.err &
	@sleep 0.5
	@echo "\r     [ $(YELLOW)#$(RESET) ]"
	@echo ""
	@sleep 0.5

	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)It has been completed.$(RESET)"
	@echo ""

end:
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)Trying to terminate all $(NAME) application server$(RESET)"
	@echo ""
	@sh ./script/Terminator.sh
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)It has been completed.$(RESET)"
	@echo ""

check:
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)Initialize a Environment Checker$(RESET)"
	@echo ""
	@sh ./script/EnvironmentChecker.sh
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)It has been completed.$(RESET)"
	@echo ""

ip:
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)Looking for IP Address$(RESET)"
	@echo ""
	@sh ./script/IPAddress.sh
	@echo ""

apijs:
	@vim client/src/constants/api.js

urljs:
	@vim client/src/constants/url.js

ffmpeg:
	@echo ""
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)Installing FFMPEG$(RESET)"
	@echo ""
	@cd stream && rm -rf resources
	@cd stream && mkdir resources
	@cd stream && rm -rf temp
	@cd stream && mkdir temp
	@cd stream/temp && curl -O https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-20200224-bc9b635-macos64-static.zip --silent
	@cd stream/temp && unzip -a ffmpeg-20200224-bc9b635-macos64-static.zip  > /dev/null
	@mv stream/temp/ffmpeg-20200224-bc9b635-macos64-static/bin/ffmpeg stream/resources
	@rm -rf stream/temp
	@echo "$(GREEN_BOLD)$(NAME) APP > $(WHITE_BOLD)FFMPEG has installed..$(RESET)"
	@echo ""