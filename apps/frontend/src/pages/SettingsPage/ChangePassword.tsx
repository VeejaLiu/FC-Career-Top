import {
  IconEyeClosed,
  IconEyeOpened,
  IconTickCircle,
} from '@douyinfe/semi-icons';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { UserApis } from '../../service/UserApis';
import { removeToken } from '../../common/common';

type Field = 'oldPassword' | 'newPassword' | 'confirmNewPassword';
const fields: Field[] = ['oldPassword', 'newPassword', 'confirmNewPassword'];

export default function ChangePasswordComponent({
  localeData,
}: {
  localeData: any;
}) {
  const copy = localeData.PasswordForm;
  const [values, setValues] = useState<Record<Field, string>>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [visible, setVisible] = useState<Partial<Record<Field, boolean>>>({});
  const [formError, setFormError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  useEffect(() => {
    let active = true;
    void UserApis.getUserInfo().then((account) => {
      if (active && account) setAccountEmail(account.email);
    });
    return () => {
      active = false;
    };
  }, []);
  const pending = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const [focusRequest, setFocusRequest] = useState<{ field: Field } | null>(
    null,
  );
  useEffect(() => {
    if (focusRequest && !submitting) {
      form.current
        ?.querySelector<HTMLInputElement>(`#${focusRequest.field}`)
        ?.focus();
    }
  }, [focusRequest, submitting]);

  const validate = (field: Field) => {
    const value = values[field];
    if (!value) return copy.Required;
    if (field === 'newPassword') {
      const categories = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*(),.?":{}|<>]/];
      if (
        value.length < 6 ||
        categories.filter((pattern) => pattern.test(value)).length < 3
      )
        return copy.InvalidFormat;
      if (new TextEncoder().encode(value).length > 72) return copy.TooLong;
      if (value === values.oldPassword)
        return localeData.ChangePasswordNotification.PASSWORD_SAME_AS_OLD;
    }
    if (field === 'confirmNewPassword' && value !== values.newPassword)
      return localeData.ChangePasswordNotification.PASSWORD_MISMATCH;
    return '';
  };

  const focusField = (field: Field) => {
    setFocusRequest({ field });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending.current || success || sessionExpired) return;
    const nextErrors = Object.fromEntries(
      fields.map((field) => [field, validate(field)]),
    );
    setErrors(nextErrors);
    setFormError('');
    const invalid = fields.find((field) => nextErrors[field]);
    if (invalid) {
      focusField(invalid);
      return;
    }

    pending.current = true;
    setFocusRequest(null);
    setSubmitting(true);
    // Pause this tab's socket so session invalidation cannot interrupt confirmation.
    window.dispatchEvent(new Event('fct-password-change-started'));
    try {
      const result = await UserApis.changePassword(values);
      if (result.success) {
        removeToken();
        setValues({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        setSuccess(true);
      } else {
        let field: Field | undefined;
        let message = '';
        switch (result.code) {
          case 'PASSWORD_UPDATE_INCORRECT_OLD':
            field = 'oldPassword';
            message =
              localeData.ChangePasswordNotification.INCORRECT_OLD_PASSWORD;
            break;
          case 'PASSWORD_UPDATE_MISMATCH':
            field = 'confirmNewPassword';
            message = localeData.ChangePasswordNotification.PASSWORD_MISMATCH;
            break;
          case 'PASSWORD_UPDATE_SAME_AS_OLD':
            field = 'newPassword';
            message =
              localeData.ChangePasswordNotification.PASSWORD_SAME_AS_OLD;
            break;
        }
        if (field) {
          setErrors({ [field]: message });
          focusField(field);
        } else if (result.status === 401) {
          removeToken();
          setSessionExpired(true);
          setFormError(copy.SessionExpired);
        } else {
          setFormError(
            result.status === 429 ? copy.RateLimited : copy.TryAgain,
          );
        }
      }
    } catch {
      setFormError(copy.TryAgain);
    } finally {
      pending.current = false;
      setSubmitting(false);
      window.dispatchEvent(new Event('fct-password-change-finished'));
    }
  };

  if (success)
    return (
      <section className="password-card password-success" role="status">
        <IconTickCircle className="password-success-icon" size="extra-large" />
        <h1 ref={(node) => node?.focus()} tabIndex={-1}>
          {copy.SuccessTitle}
        </h1>
        <p>{copy.SuccessDescription}</p>
        <a className="password-button password-button-primary" href="/">
          {copy.SignIn}
        </a>
      </section>
    );

  const labels = {
    oldPassword: localeData.OldPassword,
    newPassword: localeData.NewPassword,
    confirmNewPassword: localeData.ConfirmNewPassword,
  };

  return (
    <form
      id="change-password-form"
      ref={form}
      className="password-card"
      onSubmit={submit}
      noValidate
      aria-busy={submitting}
    >
      <h1>{localeData.AccountChangePassword}</h1>
      {accountEmail && (
        <input
          type="text"
          name="email"
          autoComplete="username"
          value={accountEmail}
          readOnly
          hidden
        />
      )}
      {fields.map((field) => (
        <div className="password-field" key={field}>
          <label htmlFor={field}>{labels[field]}</label>
          <div
            className={`password-input${errors[field] ? ' password-input-invalid' : ''}`}
          >
            <input
              id={field}
              name={field}
              required
              type={visible[field] ? 'text' : 'password'}
              autoComplete={
                field === 'oldPassword' ? 'current-password' : 'new-password'
              }
              autoFocus={field === 'oldPassword'}
              disabled={submitting || sessionExpired}
              value={values[field]}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={`${field}-error${field === 'newPassword' ? ' password-rules' : ''}`}
              onChange={(event) => {
                setValues({ ...values, [field]: event.target.value });
                setErrors((previous) => ({
                  ...previous,
                  [field]: '',
                  ...(field !== 'confirmNewPassword'
                    ? { confirmNewPassword: '' }
                    : {}),
                }));
                setFormError('');
              }}
              onBlur={() =>
                setErrors((previous) => ({
                  ...previous,
                  [field]: validate(field),
                }))
              }
            />
            <button
              type="button"
              disabled={submitting || sessionExpired}
              aria-label={`${visible[field] ? copy.Hide : copy.Show} · ${labels[field]}`}
              aria-pressed={Boolean(visible[field])}
              onClick={() =>
                setVisible({ ...visible, [field]: !visible[field] })
              }
            >
              {visible[field] ? <IconEyeOpened /> : <IconEyeClosed />}
            </button>
          </div>
          {field === 'newPassword' && (
            <p className="password-hint" id="password-rules">
              {copy.Rules}
            </p>
          )}
          <p
            className="password-error"
            id={`${field}-error`}
            aria-live="polite"
          >
            {errors[field]}
          </p>
        </div>
      ))}
      <p className="password-hint password-session-note">{copy.SignInNotice}</p>
      {formError && (
        <p className="password-error password-form-error" role="alert">
          {formError}
        </p>
      )}
      <div className="password-actions">
        {submitting ? (
          <button className="password-button" type="button" disabled>
            {copy.Cancel}
          </button>
        ) : (
          <Link className="password-button" to="/settings">
            {copy.Cancel}
          </Link>
        )}
        {sessionExpired ? (
          <a className="password-button password-button-primary" href="/">
            {copy.SignIn}
          </a>
        ) : (
          <button
            className="password-button password-button-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? copy.Submitting : localeData.ChangePassword}
          </button>
        )}
      </div>
    </form>
  );
}
