// src/features/invitations/types.ts
export interface SendInvitationRequest {
  senderId: string
  recipientId: string
}

export interface SendInvitationResponse {
  message: string
}

export interface HandleInvitationRequest {
  userId: string
  invitationId: string
  action: 'accept' | 'reject'
}

export interface HandleInvitationResponse {
  message: string
  invitationId: string
  status: 'accepted' | 'rejected'
  friendId?: string
}

export interface GetInvitationsResponse {
  message: string
  pendingRequests: string[]
  sentRequests: string[]
  friends: string[]
}
