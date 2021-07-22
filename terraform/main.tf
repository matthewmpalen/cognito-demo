provider "aws" {
  region = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

data "aws_caller_identity" "current" {}

resource "aws_cognito_user_pool" "cognito-demo" {
  name = "cognito-demo-${var.env}"
  username_attributes = ["email"]

  password_policy {
    minimum_length = 8
    require_lowercase = true
    require_numbers = true
    require_symbols = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  schema {
    name = "active"
    attribute_data_type = "Number"
    mutable = true
    required = false

    number_attribute_constraints {
      min_value = 0
      max_value = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  lambda_config {
    post_confirmation = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:cognito-demo-postconfirmation"
    pre_sign_up = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:cognito-demo-presignup"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 1
    }

    recovery_mechanism {
      name     = "verified_email"
      priority = 2
    }
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
    email_subject_by_link = "Your verification link"
    email_message_by_link = "Please click the link below to verify your email address. {##Click Here##}"
  }

  device_configuration {
    device_only_remembered_on_user_prompt = false
  }

  tags = {
    Terraform = "true"
    Environment = var.env
  }
}

resource "aws_cognito_user_group" "admin" {
  name = "Admin"
  user_pool_id = aws_cognito_user_pool.cognito-demo.id
  description = "Administrators"
}

resource "aws_cognito_user_group" "tier0" {
  name = "Tier0"
  user_pool_id = aws_cognito_user_pool.cognito-demo.id
  description = "Free tier"
  precedence = 2
}

resource "aws_cognito_user_group" "tier1" {
  name = "Tier1"
  user_pool_id = aws_cognito_user_pool.cognito-demo.id
  description = "Basic tier"
  precedence = 1
}

resource "aws_cognito_user_pool_client" "client" {
  name = "cognito-demo-web"
  user_pool_id = aws_cognito_user_pool.cognito-demo.id
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user_pool_domain" "copado-demo" {
  domain       = "copado-demo"
  user_pool_id = aws_cognito_user_pool.cognito-demo.id
}
