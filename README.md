# WOWS_AutoSign
窝窝屎国服热点批量自动签到
在userlist.json中写入用户数据即可,注意JSON格式
其中account为登录账户，比如手机号或者邮箱
zoneid为南区/北区，南区为6700200，北区为6700100
spa_id可以在preferences.xml中找到，其格式如下
    ```
		<net_credentials>
			<base>
				<login>	YOUR ACCOUNT	</login>
				<token>	*:YOUR SPA_ID:*******************:*************************	</token>
				<name>	Your WOWS ID	</name>
				<save_credentials>	true	</save_credentials>
			</base>
			<demo />
			<external />
			<active_server>	&#231;&#148;&#181;&#228;&#191;&#161;&#239;&#188;&#136;&#229;&#141;&#151;&#230;&#150;&#185;&#239;&#188;&#137;	</active_server>
		</net_credentials>
    ```
