from django.utils import timezone
from django.shortcuts import get_list_or_404, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import permissions, views, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from .serializers import *
from rest_framework.pagination import PageNumberPagination

# VIEWSETS

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    #lookup_field = 'username'
    
    def get_serializer_class(self):
        if self.request.user.is_staff:
            return FullUserSerializer
        return SmallUserSerializer

    def list(self, request, *args, **kwargs):
        try:
            # user is logged in
            user = get_object_or_404(User, id=request.user.id)
            if request.user.is_staff:
                # user is staff
                return Response(FullUserSerializer(user).data, status=HTTP_200_OK)
            else:
                return Response(SmallUserSerializer(user).data, status=HTTP_200_OK)
        except:
            queryset = self.get_queryset()
            paginator = PageNumberPagination()
            paginator.page_size = 12
            result_page = paginator.paginate_queryset(queryset, request)
            serializer = SmallUserSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

    @action(methods=["post"], detail=False)
    def existing(self, request, *args, **kwargs):
        try:
            username = request.data['username']
        except:
            try:
                password = request.data['password']
                return Response({"username": "This field is required"}, status=HTTP_400_BAD_REQUEST)
            except:
                return Response({"username": "This field is required", 'password': 'This field is required'}, status=HTTP_400_BAD_REQUEST)
        try:
            password = request.data['password']
        except:
            return Response({'password': 'This field is required'}, status=HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=username)
            if(user.check_password(password)):
                return Response({"detail": "OK"}, status=HTTP_200_OK)
            else:
                return Response({"password": "Password is incorrect"}, status=HTTP_400_BAD_REQUEST)    
        except User.DoesNotExist:
            return Response({"username": "No user matching this username was found"}, status=HTTP_200_OK)
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'slug'
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['title', 'price', 'created_at']
    ordering = ['-created_at']

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductImageSerializer


class OrderViewSet(viewsets.ModelViewSet):      
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    #lookup_field = 'user__username'
    #lookup_url_kwarg = 'username'

    def list(self, request, *args, **kwargs):
        try:
            user_orders = Order.objects.get(user=self.request.user)
            return Response(OrderSerializer(user_orders, context={"request": request}).data, status=HTTP_200_OK)
        except:
            return Response({'detail': 'You have no active orders'}, status=HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        try:
            order = get_object_or_404(Order, pk=kwargs['pk'])
            #order = self.get_object()
        except:
            return Response({"detail": "Order does not exist"}, status=HTTP_200_OK)

        # check if order belongs to the same user that is logged in 
        if order.user.username != request.user.username:
            return Response({"detail": "Cannot delete foreign orders"}, status=HTTP_403_FORBIDDEN)
        else:
            try:
                lines = get_list_or_404(Orderline, order_id=order.id)            
                for line in lines:
                    line.delete()
                order.delete()
            except:
                order.delete()
            
            return Response({"detail": "Order successfuly deleted"}, status=HTTP_200_OK)
         
        
    def create(self, request):       
        # input check

        if (type(request.data['product']) == int) and type(request.data['quantity']) == int:
            # both integer inputs - so far so good
            if request.data['quantity'] <= 0:
                return Response({"detail": "Bad quantity input. Expecting <int> (min_value=1)"}, status=HTTP_400_BAD_REQUEST) 
            elif request.data['product'] <=0 : 
                return Response({"detail": "Bad product input. Expecting <int> (min_value=1)"}, status=HTTP_400_BAD_REQUEST) 
            else: pass   
        else:
            return Response({"detail": "Bad input. Expecting obj - { 'product': <int>, 'quantity': <int> } "}, status=HTTP_400_BAD_REQUEST)

        try:
            product = get_object_or_404(Product, pk=request.data['product'])
        except:
            return Response({"detail": "Product not found"}, status=HTTP_200_OK)
        # check if user has active order.. if not - create a new one
        try:
            # print("GETTING ORDER")
            user = User.objects.get(pk=request.user.id)
            # print(user)
            # print(user.id)
            active_order = get_object_or_404(Order, user=user)
            # if active_order returns an object (user has a started order) - add to that order
            # print("ACTIVE_ORDER_FOUND:")
            # print(active_order)
            #check if product already in order - if so, update - if not - add
            # print("Looking...")
            existing_orderline = Orderline.objects.filter(order=active_order, product=product)
            # print("PRODUCT FOUND IN ORDERLINE")
            # print(existing_orderline)
            if len(existing_orderline) == 1:
                # Product already in cart.. updating quantity...
                # print("Product already in cart.. updating quantity...")
                existing_orderline[0].quantity = request.data['quantity']
                existing_orderline[0].save()
            else:
                # Product NOT in cart.. adding product"
                # print("Product NOT in cart.. adding product")
                Orderline.objects.create(order=active_order, product=product, quantity=request.data['quantity'] )               
            active_order.modified_at = timezone.now()
            active_order.save()
            return Response(OrderSerializer(active_order, context={"request": request}).data, status=HTTP_201_CREATED)
        except:
            # if here, there is no active order for this user, and a new one should be created
            # print("CREATING NEW ORDER..")
            new_order = Order.objects.create(user=request.user)
            Orderline.objects.create(order=new_order, product=product, quantity=request.data['quantity'] )
            return Response(OrderSerializer(new_order, context={"request": request}).data, status=HTTP_201_CREATED)

    @action(methods=['delete'], detail=False)
    def remove_from_cart(self, request, *args, **kwargs):
        try:
            order = get_object_or_404(Order, user=request.user.id)
            # if ok, there is an active order already - check if request.data['id'] is in orderlines and if so - delete
            try:
                # find orderline by order.id and orderline.id (request.data['id'] is the id of the orderline to be deleted)
                get_object_or_404(Orderline, order_id=order.id, id=request.data['id']).delete()
                # check if no other orderlines are left. if none - delete order.. dunno takes less space or smth
                try:
                    none_left = len(get_list_or_404(Orderline, order=order.id))
                except:
                    # if here.. there are no more orderlines.. should delete whole order
                    order.delete()
                    return Response({'detail': 'You have no active orders'}, status=HTTP_200_OK)
                
                return Response(OrderSerializer(order, context={"request": request}).data, status=HTTP_200_OK)
            except:
                # either no matching id was found, or user is trying to delete foreign orderlines.. not cool
                return Response({"detail": "ID of product not found in current order."}, status=HTTP_200_OK)
        except:
            return Response({"detail": "No orders found. Cannot delete product from non-existing orderline"}, status=HTTP_200_OK)

    

class OrderlineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Orderline.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = OrderlineSerializer

# VIEWS

class CheckTokenValidity(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """
        Check if request's header has a valid access token attached.
        """
        # if the response is shown, request has a valid access token attached

        return Response({"detail": "OK"}, status=HTTP_200_OK)