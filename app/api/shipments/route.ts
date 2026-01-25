/**
 * Example API Route: Shipments
 * Demonstrates role-based access control for API endpoints
 */

import { NextRequest } from 'next/server';
import {
  requireAuth,
  requirePermission,
  requireResourceAccess,
  createSuccessResponse,
  createErrorResponse,
  withAuth,
  withRole,
  applyRateLimit,
  auditLog,
} from '@/lib/auth/api-protection';
import { UserRole } from '@/lib/auth/roles';
import { ResourceType, Action } from '@/lib/auth/access-control';

/**
 * GET /api/shipments
 * List all shipments (role-based filtering applied)
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, 60, 60000); // 60 requests per minute
  if (rateLimitResult.error) {
    return rateLimitResult.error;
  }

  // Check resource access
  const { error, user } = await requireResourceAccess(
    request,
    ResourceType.SHIPMENT,
    Action.LIST
  );

  if (error) return error;

  // Audit log
  await auditLog(user!.id, 'LIST_SHIPMENTS', 'shipments');

  // Mock data - in production, fetch from database with company filtering
  const shipments = [
    {
      id: '1',
      trackingNumber: 'SHP001',
      origin: 'Nairobi, Kenya',
      destination: 'Kampala, Uganda',
      status: 'in-transit',
      companyId: user!.companyId,
    },
    // Only return shipments belonging to user's company
  ].filter(s => s.companyId === user!.companyId);

  return createSuccessResponse(
    { shipments, total: shipments.length },
    200
  );
}

/**
 * POST /api/shipments
 * Create a new shipment (Shipper and Admin only)
 */
export const POST = withRole(
  [UserRole.SHIPPER, UserRole.ADMIN],
  async (request: NextRequest, user) => {
    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(request, 20, 60000); // 20 creates per minute
    if (rateLimitResult.error) {
      return rateLimitResult.error;
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    // Validate required fields
    const { origin, destination, cargo } = body;
    if (!origin || !destination || !cargo) {
      return createErrorResponse(
        'Missing required fields: origin, destination, cargo',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Audit log
    await auditLog(user.id, 'CREATE_SHIPMENT', 'shipments', body);

    // Mock shipment creation - in production, save to database
    const newShipment = {
      id: Date.now().toString(),
      trackingNumber: `SHP${Date.now()}`,
      origin,
      destination,
      cargo,
      status: 'pending',
      companyId: user.companyId,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    return createSuccessResponse(
      { shipment: newShipment },
      201
    );
  }
);

/**
 * PUT /api/shipments/[id]
 * Update shipment (Shipper and Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requirePermission(request, 'EDIT_SHIPMENT');

  if (error) return error;

  const shipmentId = params.id;

  // In production, verify shipment belongs to user's company
  // const shipment = await db.shipment.findUnique({ where: { id: shipmentId } });
  // if (shipment.companyId !== user.companyId) {
  //   return createErrorResponse('Shipment not found', 404, 'NOT_FOUND');
  // }

  let body;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse('Invalid JSON body', 400, 'INVALID_JSON');
  }

  // Audit log
  await auditLog(user!.id, 'UPDATE_SHIPMENT', `shipments/${shipmentId}`, body);

  // Mock update
  const updatedShipment = {
    id: shipmentId,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return createSuccessResponse(
    { shipment: updatedShipment },
    200
  );
}

/**
 * DELETE /api/shipments/[id]
 * Delete shipment (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requirePermission(request, 'DELETE_SHIPMENT');

  if (error) return error;

  const shipmentId = params.id;

  // Audit log
  await auditLog(user!.id, 'DELETE_SHIPMENT', `shipments/${shipmentId}`);

  // Mock deletion - in production, soft delete from database
  return createSuccessResponse(
    { message: 'Shipment deleted successfully' },
    200
  );
}
