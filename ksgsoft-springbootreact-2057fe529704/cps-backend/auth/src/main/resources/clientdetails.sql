-- Define two client ids & secrets for cps admin front-end, cps somos client front-end

-- access token validity : 3600 (1 hour)
-- refresh token validity : 2592000 (30 days)

-- Secret passwords are encoded with BCryptEncoder
-- CPS Admin ClientId/Secret/Encoded Secret
-- j4yc5uq84922y24nt7f3 / 9WBYMUFJBaj9RwUrF49m / $2a$10$QWkCbrKnqgLi20pDv6yfseUg6whdyuoCrg/hFJ3RcpckB8/yno2PC
--
-- SOMOS ClientId/Secret/Encoded Secret
-- i5521x0ppw1q241kc4m0 / xZqnR9g6tn6QCXyPkybm / $2a$10$3ELXBeYlI2aZQixPDqdy7u.38Wtkj1FXGfzfajdxymlecU0O/wODG
--

SET @access_token_validty = 3600;
SET @refresh_token_validity = 2592000;

SET @cps_client_id = '';

INSERT INTO oauth_client_details
	(client_id, client_secret, scope, authorized_grant_types,
	web_server_redirect_uri, authorities, access_token_validity,
	refresh_token_validity, additional_information, autoapprove)
VALUES
	('j4yc5uq84922y24nt7f3', '$2a$10$QWkCbrKnqgLi20pDv6yfseUg6whdyuoCrg/hFJ3RcpckB8/yno2PC', 'cps,read,write',
	'password,authorization_code,refresh_token', null, null, @access_token_validty, @refresh_token_validity, null, true);

INSERT INTO oauth_client_details
	(client_id, client_secret, scope, authorized_grant_types,
	web_server_redirect_uri, authorities, access_token_validity,
	refresh_token_validity, additional_information, autoapprove)
VALUES
	('i5521x0ppw1q241kc4m0', '$2a$10$3ELXBeYlI2aZQixPDqdy7u.38Wtkj1FXGfzfajdxymlecU0O/wODG', 'somos,read,write',
	'password,authorization_code,refresh_token', null, null, @access_token_validty, @refresh_token_validity, null, true);