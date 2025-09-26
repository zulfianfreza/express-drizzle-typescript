CREATE TABLE `lk_account_purposes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_active` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lk_account_purposes_id` PRIMARY KEY(`id`),
	CONSTRAINT `lk_account_purposes_code_unique` UNIQUE(`code`)
);
