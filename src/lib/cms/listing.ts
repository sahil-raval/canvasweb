/** A listing is sold when its status (set from Agentbox) is "Sold". */
export const isSold = (status?: string) => (status || '').toLowerCase() === 'sold'
