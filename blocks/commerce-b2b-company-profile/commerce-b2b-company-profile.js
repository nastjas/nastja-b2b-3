/**
 * Alias block for `commerce-b2b-company-profile`.
 *
 * Authored content on some pages (e.g. /customer/company/profile) uses the
 * block name `commerce-b2b-company-profile`, while the actual Commerce
 * drop-in integration lives in `commerce-company-profile`. EDS resolves a
 * block's JS/CSS purely from its CSS class name, so the name mismatch left
 * the block undecorated. This thin wrapper re-uses the real implementation
 * so both naming variants render the same Company Profile drop-in.
 */
import decorate from '../commerce-company-profile/commerce-company-profile.js';

export default decorate;
